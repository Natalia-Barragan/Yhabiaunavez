
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yhabiaunavez.onrender.com';

// Sistema simple de caché (5 minutos)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function getCacheKey(endpoint: string, options: RequestInit) {
  // Solo cachear GET requests
  if (options.method && options.method !== 'GET') return null;
  return `${endpoint}`;
}

function getFromCache(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  // Verificar caché para GET requests
  const cacheKey = getCacheKey(endpoint, options);
  if (cacheKey) {
    const cached = getFromCache(cacheKey);
    if (cached) return cached;
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  const data = await res.json();
  
  // Guardar en caché si es GET
  if (cacheKey) {
    setCache(cacheKey, data);
  }
  
  return data;
}

async function fetchFormData(endpoint: string, data: FormData, method: string = 'POST') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    body: data,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/login';
      }
    }
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || 'API Error');
  }

  if (res.status === 204) return null;
  return res.json();
}


export const api = {
  auth: {
    login: (credentials: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },
  products: {
    getAll: () => fetchAPI('/products'),
    getOne: (id: string) => fetchAPI(`/products/${id}`),
    create: (data: FormData) => fetchFormData('/products', data),
    update: (id: string, data: Partial<any>) => fetchAPI(`/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    uploadProductImages: (id: string, data: FormData) => fetchFormData(`/products/${id}/images`, data, 'POST'),
    delete: (id: string) => fetchAPI(`/products/${id}`, { method: 'DELETE' }),
  },
  categories: {
    getAll: () => fetchAPI('/categories'),
    create: (data: any) => fetchAPI('/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/categories/${id}`, { method: 'DELETE' }),
  },
  orders: {
    getAll: () => fetchAPI('/orders'),
    create: (data: any) => fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      fetchAPI(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  customers: {
    getAll: () => fetchAPI('/customers'),
    getOne: (id: string) => fetchAPI(`/customers/${id}`),
    create: (data: any) => fetchAPI('/customers', { method: 'POST', body: JSON.stringify(data) }),
    getByEmail: (email: string) => fetchAPI(`/customers/email/${email}`),
    update: (id: string, data: Partial<any>) => fetchAPI(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/customers/${id}`, { method: 'DELETE' }),
  },
  sizes: {
    getAll: () => fetchAPI('/sizes'),
    create: (data: any) => fetchAPI('/sizes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => fetchAPI(`/sizes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchAPI(`/sizes/${id}`, { method: 'DELETE' }),
  },
  mercadopago: {
    createPreference: (orderId: string) => fetchAPI('/mercadopago/create-preference', { method: 'POST', body: JSON.stringify({ orderId }) }),
    verifyPayment: (paymentId: string) => fetchAPI('/mercadopago/verify', { method: 'POST', body: JSON.stringify({ paymentId }) }),
  }
};
