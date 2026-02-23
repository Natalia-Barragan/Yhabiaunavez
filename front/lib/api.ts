
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yhabiaunavez.onrender.com';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
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
    const error = await res.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  return res.json();
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
    updateImage: (id: string, data: FormData) => fetchFormData(`/products/${id}`, data, 'PATCH'),
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
    create: (data: any) => fetchAPI('/customers', { method: 'POST', body: JSON.stringify(data) }),
    getByEmail: (email: string) => fetchAPI(`/customers/email/${email}`),
  }
};
