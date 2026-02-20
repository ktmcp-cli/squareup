import axios from 'axios';
import { getConfig } from './config.js';

function getBaseURL() {
  const env = getConfig('environment') || 'production';
  return env === 'sandbox'
    ? 'https://connect.squareupsandbox.com/v2'
    : 'https://connect.squareup.com/v2';
}

function getAccessToken() {
  const token = getConfig('accessToken');
  if (!token) {
    throw new Error('Access token not configured. Run: squareup config set --access-token YOUR_TOKEN');
  }
  return token;
}

async function request(method, endpoint, data = null) {
  const baseURL = getBaseURL();
  const token = getAccessToken();

  try {
    const response = await axios({
      method,
      url: `${baseURL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18'
      },
      data
    });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      const errData = error.response.data;
      const errMsg = errData.errors?.[0]?.detail || JSON.stringify(errData);
      throw new Error(`API Error: ${errMsg}`);
    }
    throw new Error(`Request failed: ${error.message}`);
  }
}

// ============================================================
// Payments
// ============================================================

export async function listPayments(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await request('GET', `/payments${query ? '?' + query : ''}`);
}

export async function getPayment(paymentId) {
  return await request('GET', `/payments/${paymentId}`);
}

export async function createPayment(paymentData) {
  return await request('POST', '/payments', paymentData);
}

// ============================================================
// Customers
// ============================================================

export async function listCustomers(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await request('GET', `/customers${query ? '?' + query : ''}`);
}

export async function getCustomer(customerId) {
  return await request('GET', `/customers/${customerId}`);
}

export async function createCustomer(customerData) {
  return await request('POST', '/customers', customerData);
}

export async function searchCustomers(query) {
  return await request('POST', '/customers/search', { query });
}

// ============================================================
// Orders
// ============================================================

export async function searchOrders(searchQuery) {
  return await request('POST', '/orders/search', searchQuery);
}

export async function getOrder(orderId) {
  return await request('GET', `/orders/${orderId}`);
}

export async function createOrder(orderData) {
  return await request('POST', '/orders', orderData);
}

// ============================================================
// Locations
// ============================================================

export async function listLocations() {
  return await request('GET', '/locations');
}

export async function getLocation(locationId) {
  return await request('GET', `/locations/${locationId}`);
}

// ============================================================
// Catalog
// ============================================================

export async function listCatalog(params = {}) {
  const query = new URLSearchParams(params).toString();
  return await request('GET', `/catalog/list${query ? '?' + query : ''}`);
}

export async function searchCatalog(searchQuery) {
  return await request('POST', '/catalog/search', searchQuery);
}
