import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get PayPal access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const currency = body.currency || 'INR';
    const orderId = body.orderId;
    const items = body.items;
    
    // Ensure amount is a number
    const amount = typeof body.amount === 'string' ? parseFloat(body.amount) : Number(body.amount);

    console.log('Creating PayPal order:', { amount, currency, orderId, itemCount: items?.length });

    if (!amount || isNaN(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = await getPayPalAccessToken();
    console.log('Got PayPal access token');

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: orderId || `ORDER-${Date.now()}`,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
          breakdown: {
            item_total: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        },
        items: items?.map((item: { name: string; price: number; quantity: number }) => ({
          name: item.name.substring(0, 127),
          quantity: String(item.quantity),
          unit_amount: {
            currency_code: currency,
            value: item.price.toFixed(2),
          },
        })) || [],
      }],
      application_context: {
        brand_name: 'ERUM - The Jewellery Studio',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: `${req.headers.get('origin') || 'https://erum.lovable.app'}/checkout?success=true`,
        cancel_url: `${req.headers.get('origin') || 'https://erum.lovable.app'}/checkout?cancelled=true`,
      },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('PayPal create order failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to create PayPal order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const paypalOrder = await response.json();
    console.log('PayPal order created:', paypalOrder.id);

    return new Response(
      JSON.stringify({
        orderId: paypalOrder.id,
        approvalUrl: paypalOrder.links.find((link: { rel: string }) => link.rel === 'approve')?.href,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
