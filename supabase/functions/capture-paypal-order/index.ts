import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_CLIENT_ID = (Deno.env.get('PAYPAL_CLIENT_ID') ?? '').trim();
const PAYPAL_SECRET_KEY = (Deno.env.get('PAYPAL_SECRET_KEY') ?? '').trim();
const PAYPAL_API_URL = 'https://api-m.paypal.com'; // Live (production)
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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
    const { paypalOrderId, dbOrderId } = await req.json();

    console.log('Capturing PayPal order:', { paypalOrderId, dbOrderId });

    if (!paypalOrderId) {
      return new Response(
        JSON.stringify({ error: 'PayPal order ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const accessToken = await getPayPalAccessToken();
    console.log('Got PayPal access token for capture');

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('PayPal capture failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to capture PayPal payment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const captureData = await response.json();
    console.log('PayPal payment captured:', captureData.status);

    // Update order status in database if dbOrderId is provided
    if (dbOrderId && captureData.status === 'COMPLETED') {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          payment_status: 'paid',
          status: 'confirmed',
          notes: `PayPal Transaction ID: ${captureData.id}`
        })
        .eq('id', dbOrderId);

      if (updateError) {
        console.error('Failed to update order:', updateError);
      } else {
        console.log('Order updated successfully');
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: captureData.status,
        transactionId: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.id,
        payerEmail: captureData.payer?.email_address,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
