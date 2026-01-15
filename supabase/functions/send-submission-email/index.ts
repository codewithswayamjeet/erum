import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, submission_type, design_image_url }: SubmissionEmailRequest = await req.json();

    console.log("Sending submission notification email for:", name, email);

    // For now, we'll use a simple fetch to an email API
    // You can configure Resend or another email provider with RESEND_API_KEY
    const emailBody = `
New ${submission_type === 'bespoke' ? 'Bespoke Consultation' : 'Contact'} Submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

${design_image_url ? `Design Image: ${design_image_url}` : 'No design image uploaded'}

---
This is an automated notification from ERUM Jewelry website.
    `.trim();

    // Log the email content for now (can be replaced with actual email sending)
    console.log("Email content:", emailBody);

    // If RESEND_API_KEY is configured, send via Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (resendApiKey) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ERUM Jewelry <notifications@erum.in>",
          to: ["Contact@erum.in"],
          subject: `New ${submission_type === 'bespoke' ? 'Bespoke Request' : 'Contact Message'} from ${name}`,
          text: emailBody,
          html: `
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
          `,
        }),
      });

      const emailResult = await emailResponse.json();
      console.log("Email sent via Resend:", emailResult);
    } else {
      console.log("RESEND_API_KEY not configured. Email logged but not sent.");
    }

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
