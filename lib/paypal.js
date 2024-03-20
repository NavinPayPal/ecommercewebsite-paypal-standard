async function fetchToken() {
  const response = await fetch('api/paypal/token', { method: 'POST' });
  const data = await response.json();
  return data.accessToken;
}

async function createOrder(cartItems) {
  const accessToken = await fetchToken();
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cart: cartItems })
  });
  const data = await response.json();
  return data.id;
}

async function onApprove(orderId) {
  const response = await fetch(`/api/orders/${orderId}/capture`, {
    method: 'POST',
  });
  const data = await response.json();
  return data;
}

export {fetchToken, createOrder, onApprove}