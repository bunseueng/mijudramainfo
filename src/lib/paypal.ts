const NODE_ENV = process.env.NODE_ENV
const base = NODE_ENV === "development" ? process.env.PAYPAL_API_URL : "https://api.paypal.com";

export const paypal = {
  createOrder: async function createOrder(price: number) {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders`;
      console.log('Creating order with URL:', url);
      console.log('Request body:', {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: price,
            },
          },
        ],
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: price,
              },
            },
          ],
        }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  },

  capturePayment: async function capturePayment(orderId: string) {
    try {
      const accessToken = await generateAccessToken();
      const url = `${base}/v2/checkout/orders/${orderId}/capture`;
      console.log('Capturing payment with URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error capturing PayPal payment:', error);
      throw error;
    }
  },
};

async function generateAccessToken() {
  try {
    const { PAYPAL_CLIENT_ID, PAYPAL_SECRET } = process.env;
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
    const url = `${base}/v1/oauth2/token`;
    console.log('Generating access token with URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const jsonData = await handleResponse(response);
    console.log('Access token:', jsonData.access_token);
    return jsonData.access_token;
  } catch (error) {
    console.error('Error generating PayPal access token:', error);
    throw error;
  }
}

async function handleResponse(response: Response) {
  if (response.ok) {
    return response.json();
  }

  const errorMessage = await response.text();
  console.error('PayPal API error:', errorMessage);
  throw new Error(errorMessage);
}
