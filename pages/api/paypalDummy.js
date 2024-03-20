import { paypalClient } from '../../lib/paypal';

export default async function handler(req, res) {
  const request = new paypal.core.AccessTokenRequest();
  const client = paypalClient();

  const { CLIENT_ID, CLIENT_SECRET } = process.env

  // try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials',
    });
  
    if (!response.ok) {
      console.error('Failed to fetch token:', await response.text());
      return res.status(response.status).json({error: 'Failed to fetch token from PayPal'});
    }
  
    const data = await response.json();
    return data.access_token;
  //   return res.status(200).json({ accessToken: data.access_token });
  // } catch (error) {
  //   console.error('Server error:', error);
  //   return res.status(500).json({ error: error.message });
  // }
}