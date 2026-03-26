import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function sanitizeSecret(secret: string): string {
  return secret.replace(/\s/g, '');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action, code } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    if (action === 'send') {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      const { error: insertError } = await supabase.from('email_otps').insert({
        email: email.toLowerCase().trim(),
        code: otpCode,
        expires_at: expiresAt,
        purpose: 'checkout_verification',
      });

      if (insertError) {
        console.error('OTP insert error:', insertError);
        return new Response(JSON.stringify({ error: 'Failed to generate OTP' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const smtpUser = Deno.env.get('SMTP_USER_EMAIL') || 'erumshopify19@gmail.com';
      const smtpPass = sanitizeSecret(Deno.env.get('GMAIL_APP_PASSWORD') || '');

      if (!smtpPass) {
        return new Response(JSON.stringify({ error: 'Email service not configured' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const emailHtml = `
        <div style="font-family: 'Georgia', serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://erum.lovable.app/images/erum-logo-email.png" alt="ERUM - The Jewellery Studio" style="height: 45px; width: auto;" />
          </div>
          <div style="background: #faf9f7; padding: 30px; border: 1px solid #e8e4df; text-align: center;">
            <h2 style="color: #2d3748; font-size: 18px; margin-bottom: 10px;">Verify Your Email</h2>
            <p style="color: #718096; font-size: 14px; margin-bottom: 20px;">Enter this code to complete your checkout:</p>
            <div style="background: #2d3748; color: #fff; font-size: 32px; letter-spacing: 8px; padding: 15px 30px; display: inline-block; font-weight: bold;">
              ${otpCode}
            </div>
            <p style="color: #a0aec0; font-size: 12px; margin-top: 20px;">This code expires in 10 minutes.</p>
          </div>
        </div>
      `;

      const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
      
      const client = new SMTPClient({
        connection: {
          hostname: "smtp.gmail.com",
          port: 465,
          tls: true,
          auth: {
            username: smtpUser,
            password: smtpPass,
          },
        },
      });

      await client.send({
        from: smtpUser,
        to: email,
        subject: "ÉRUM - Your Checkout Verification Code",
        content: "auto",
        html: emailHtml,
      });

      await client.close();

      return new Response(JSON.stringify({ success: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } else if (action === 'verify') {
      if (!code) {
        return new Response(JSON.stringify({ error: 'Code is required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data, error } = await supabase
        .from('email_otps')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .eq('code', code)
        .eq('purpose', 'checkout_verification')
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return new Response(JSON.stringify({ verified: false, error: 'Invalid or expired code' }), {
          status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Mark OTP as used
      await supabase.from('email_otps').update({ used: true }).eq('id', data.id);

      return new Response(JSON.stringify({ verified: true }), {
        status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use "send" or "verify".' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('OTP error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
