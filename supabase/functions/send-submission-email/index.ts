import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.10";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface SubmissionEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  submission_type: string;
  design_image_url?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, submission_type, design_image_url }: SubmissionEmailRequest = await req.json();

    console.log("Sending submission notification email for:", name, email);

    const smtpPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    const smtpUser = Deno.env.get("SMTP_USER_EMAIL") ?? "erumshopify19@gmail.com";
    const senderEmail = Deno.env.get("SMTP_FROM_EMAIL") ?? smtpUser;
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") ?? "contact@erum.in";
    const smtpHost = Deno.env.get("SMTP_HOST") ?? "smtp.gmail.com";
    const smtpPort = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const smtpSecure = (Deno.env.get("SMTP_SECURE") ?? "true").toLowerCase() !== "false";

    if (!smtpPassword) {
      throw new Error("SMTP password is not configured");
    }

    const subject = `New ${submission_type === 'bespoke' ? 'Bespoke Request' : 'Contact Message'} from ${name}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          New ${submission_type === 'bespoke' ? 'Bespoke Consultation Request' : 'Contact Message'}
        </h2>
        <table style="width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #666;">Name:</td>
            <td style="padding: 10px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #666;">Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #666;">Phone:</td>
            <td style="padding: 10px 0;">${phone || 'Not provided'}</td>
          </tr>
        </table>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Message:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        ${design_image_url ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Design Image:</h3>
            <img src="${design_image_url}" alt="Design" style="max-width: 100%; border-radius: 8px;" />
          </div>
        ` : ''}
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated notification from ERUM Jewelry website.
        </p>
      </div>
    `;

    const userConfirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          Thank You for Contacting ERUM Jewelry
        </h2>
        <p>Dear ${name},</p>
        <p>We have received your ${submission_type === 'bespoke' ? 'bespoke consultation request' : 'message'} and our team will get back to you within 24 hours.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Your Message:</h3>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <p>Best regards,<br/>The ERUM Jewelry Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #999; font-size: 12px;">
          ERUM Jewelry | Contact: contact@erum.in
        </p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.verify();

    // Send notification to admin
    await transporter.sendMail({
      from: `"ERUM Jewelry" <${senderEmail}>`,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
    });
    console.log("Admin notification email sent");

    // Send confirmation to user
    await transporter.sendMail({
      from: `"ERUM Jewelry" <${senderEmail}>`,
      to: email,
      subject: `Thank you for contacting ERUM Jewelry`,
      html: userConfirmationHtml,
    });
    console.log("User confirmation email sent to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Submission notification processed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error in send-submission-email function:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
