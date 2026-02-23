import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.9.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, body } = await req.json();

    if (!subject || !body) {
      return new Response(
        JSON.stringify({ error: "Subject and body are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
      const { data: hasAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (!hasAdmin) {
        return new Response(JSON.stringify({ error: "Admin access required" }), {
          status: 403, headers: { "Content-Type": "application/json", ...corsHeaders }
        });
      }
    } else {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Fetch active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("email")
      .eq("is_subscribed", true);

    if (fetchError) throw fetchError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No active subscribers", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!gmailAppPassword) {
      return new Response(
        JSON.stringify({ error: "SMTP not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const senderEmail = "erumshopify19@gmail.com";
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: senderEmail, pass: gmailAppPassword },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a1a; padding: 20px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 2px;">ÉRUM</h1>
          <p style="color: #fff; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px;">JEWELRY</p>
        </div>
        <div style="padding: 30px 20px;">
          <h2 style="color: #1a1a1a; margin: 0 0 20px;">${subject}</h2>
          <div style="color: #333; line-height: 1.6;">${body}</div>
        </div>
        <div style="background: #f5f5f5; padding: 20px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            ERUM Jewelry | Contact: contact@erum.in
          </p>
          <p style="color: #999; font-size: 11px; margin: 10px 0 0;">
            You received this because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    `;

    let sent = 0;
    let failed = 0;
    for (const sub of subscribers) {
      try {
        await transporter.sendMail({
          from: `"ERUM Jewelry" <${senderEmail}>`,
          to: sub.email,
          subject,
          html: htmlContent,
        });
        sent++;
      } catch (e) {
        console.error(`Failed to send to ${sub.email}:`, e);
        failed++;
      }
    }

    console.log(`Newsletter sent: ${sent} success, ${failed} failed`);

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: subscribers.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-newsletter:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
