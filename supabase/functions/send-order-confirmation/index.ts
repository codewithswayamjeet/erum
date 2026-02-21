import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderConfirmationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderConfirmationRequest = await req.json();
    const { 
      orderId, 
      customerName, 
      customerEmail, 
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      items, 
      subtotal, 
      total,
      paymentMethod 
    } = orderData;

    console.log("Sending order confirmation email to:", customerEmail);

    const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
    const senderEmail = "erumshopify19@gmail.com";
    const adminEmail = "contact@erum.in";

    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;" />` : ''}
            <span>${item.name}</span>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    // Customer confirmation email
    const customerEmailHtml = `
      <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fff;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #d4af37; margin: 0; font-size: 28px; font-weight: normal;">ERUM</h1>
          <p style="color: #fff; margin: 10px 0 0; font-size: 12px; letter-spacing: 3px;">FINE JEWELRY</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a1a1a; margin: 0 0 20px; font-weight: normal;">Thank You for Your Order!</h2>
          <p style="color: #666; line-height: 1.6;">Dear ${customerName},</p>
          <p style="color: #666; line-height: 1.6;">
            Thank you for choosing ERUM Jewelry. Your order has been confirmed and is being prepared with the utmost care.
          </p>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 30px 0; border-left: 3px solid #d4af37;">
            <p style="margin: 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
            ${paymentMethod ? `<p style="margin: 10px 0 0; color: #333;"><strong>Payment Method:</strong> ${paymentMethod}</p>` : ''}
          </div>
          
          <h3 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 12px; text-align: left;">Item</th>
                <th style="padding: 12px; text-align: center;">Qty</th>
                <th style="padding: 12px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Subtotal:</td>
                <td style="padding: 12px; text-align: right;">$${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Shipping:</td>
                <td style="padding: 12px; text-align: right; color: #d4af37;">Complimentary</td>
              </tr>
              <tr style="background: #f9f9f9;">
                <td colspan="2" style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                <td style="padding: 15px 12px; text-align: right; font-weight: bold; font-size: 18px;">$${total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          
          <h3 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 30px;">Shipping Address</h3>
          <p style="color: #666; line-height: 1.8;">
            ${customerName}<br/>
            ${shippingAddress}<br/>
            ${shippingCity}, ${shippingState} ${shippingPincode}<br/>
            ${customerPhone ? `Phone: ${customerPhone}` : ''}
          </p>
          
          <div style="margin-top: 40px; padding: 20px; background: #1a1a1a; text-align: center;">
            <p style="color: #d4af37; margin: 0 0 10px; font-size: 14px;">Need Help?</p>
            <p style="color: #fff; margin: 0; font-size: 13px;">
              Contact us at <a href="mailto:contact@erum.in" style="color: #d4af37;">contact@erum.in</a>
            </p>
          </div>
        </div>
        
        <div style="padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} ERUM Jewelry. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Admin notification email
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">
          🎉 New Order Received - #${orderId.slice(0, 8)}
        </h2>
        
        <table style="width: 100%; margin: 20px 0;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666; width: 140px;">Customer:</td>
            <td style="padding: 8px 0;">${customerName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${customerEmail}">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
            <td style="padding: 8px 0;">${customerPhone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Order Total:</td>
            <td style="padding: 8px 0; font-size: 18px; color: #d4af37; font-weight: bold;">$${total.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Payment:</td>
            <td style="padding: 8px 0;">${paymentMethod || 'N/A'}</td>
          </tr>
        </table>
        
        <h3 style="color: #333; margin-top: 30px;">Shipping Address</h3>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          <p style="margin: 0; line-height: 1.6;">
            ${shippingAddress}<br/>
            ${shippingCity}, ${shippingState} ${shippingPincode}
          </p>
        </div>
        
        <h3 style="color: #333; margin-top: 30px;">Items Ordered (${items.length})</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${items.map(item => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 12px 0;">
                <strong>${item.name}</strong><br/>
                <span style="color: #666; font-size: 13px;">Qty: ${item.quantity} × $${item.price.toLocaleString()}</span>
              </td>
              <td style="padding: 12px 0; text-align: right; font-weight: bold;">
                $${(item.price * item.quantity).toLocaleString()}
              </td>
            </tr>
          `).join('')}
        </table>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This is an automated notification from ERUM Jewelry website.
        </p>
      </div>
    `;

    if (gmailAppPassword) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: senderEmail,
          pass: gmailAppPassword,
        },
      });

      // Send confirmation to customer
      await transporter.sendMail({
        from: `"ERUM Jewelry" <${senderEmail}>`,
        to: customerEmail,
        subject: `Order Confirmed - ERUM Jewelry #${orderId.slice(0, 8)}`,
        html: customerEmailHtml,
      });
      console.log("Customer order confirmation sent to:", customerEmail);

      // Send notification to admin
      await transporter.sendMail({
        from: `"ERUM Orders" <${senderEmail}>`,
        to: adminEmail,
        subject: `🎉 New Order #${orderId.slice(0, 8)} - $${total.toLocaleString()}`,
        html: adminEmailHtml,
      });
      console.log("Admin order notification sent");
    } else {
      console.log("GMAIL_APP_PASSWORD not configured. Emails logged but not sent.");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Order confirmation emails sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error in send-order-confirmation function:", errorMessage);
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
