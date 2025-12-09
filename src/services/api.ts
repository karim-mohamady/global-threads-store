// API Configuration and Service Layer
// Configure this BASE_URL to point to your Laravel backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};


export const getAuthToken = () => authToken;

// API Request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': localStorage.getItem('language') || 'en',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authApi = {
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => apiRequest<{ message: string; user: any; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ message: string; user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),

  me: () => apiRequest<{ user: any }>('/auth/me'),

  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => apiRequest<{ message: string; user: any }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  changePassword: (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) => apiRequest<{ message: string }>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    is_featured?: boolean;
    sort?: string;
    search?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle the search filter for Spatie Query Builder
          if (key === 'search') {
            searchParams.append('filter[search]', String(value));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    const query = searchParams.toString();
    return apiRequest<{ data: any[]; meta: any }>(`/products${query ? `?${query}` : ''}`);
  },

  getOne: (id: number | string) => apiRequest<{ data: any }>(`/products/${id}`),

  // Dedicated search endpoint
  search: (params: {
    q?: string;
    query?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    color?: string;
    size?: string;
    in_stock?: boolean;
    sort?: string;
    page?: number;
    per_page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const query = searchParams.toString();
    return apiRequest<{ data: any[]; meta: any }>(`/search${query ? `?${query}` : ''}`);
  },

  create: (data: any) => apiRequest<{ message: string; product: any }>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: number | string, data: any) =>
    apiRequest<{ message: string; product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number | string) =>
    apiRequest<{ message: string }>(`/products/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoriesApi = {
  getAll: (params?: { parent_only?: boolean; with_children?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest<{ data: any[] }>(`/categories${query ? `?${query}` : ''}`);
  },

  getOne: (id: number | string) => apiRequest<{ data: any }>(`/categories/${id}`),

  create: (data: any) => apiRequest<{ message: string; category: any }>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  update: (id: number | string, data: any) =>
    apiRequest<{ message: string; category: any }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number | string) =>
    apiRequest<{ message: string }>(`/categories/${id}`, { method: 'DELETE' }),
};

// Cart API
export const cartApi = {
  get: () => apiRequest<{ cart: any }>('/cart'),

  addItem: (data: { product_id: number; quantity?: number; product_variant_id?: number }) =>
    apiRequest<{ message: string; cart: any }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItems: (items: { id: number; quantity: number }[]) =>
    apiRequest<{ message: string; cart: any }>('/cart', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),

  removeItem: (itemId: number) =>
    apiRequest<{ message: string; cart: any }>(`/cart/items/${itemId}`, { method: 'DELETE' }),

  clear: () => apiRequest<{ message: string; cart: any }>('/cart/clear', { method: 'POST' }),
};

// Wishlist API
export const wishlistApi = {
  getAll: (params?: { page?: number; per_page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest<{ data: any[]; meta: any }>(`/wishlists${query ? `?${query}` : ''}`);
  },

  add: (productId: number) =>
    apiRequest<{ message: string; wishlist: any }>('/wishlists', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  remove: (wishlistId: number) =>
    apiRequest<{ message: string }>(`/wishlists/${wishlistId}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: (params?: { page?: number; per_page?: number; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest<{ data: any[]; meta: any }>(`/orders${query ? `?${query}` : ''}`);
  },

  getOne: (id: number | string) => apiRequest<{ data: any }>(`/orders/${id}`),

  create: (data: {
    payment_method: string;
    coupon_code?: string;
    shipping_address: {
      street_address: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
      phone: string;
    };
    billing_address: {
      street_address: string;
      city: string;
      state?: string;
      postal_code: string;
      country: string;
      phone: string;
    };
  }) => apiRequest<{ message: string; order: any }>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateStatus: (id: number | string, status: string) =>
    apiRequest<{ message: string; order: any }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Reviews API
export const reviewsApi = {
  getForProduct: (productId: number | string, params?: { page?: number; per_page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, String(value));
      });
    }
    const query = searchParams.toString();
    return apiRequest<{ data: any[]; meta: any }>(
      `/products/${productId}/reviews${query ? `?${query}` : ''}`
    );
  },

  create: (data: { product_id: number; rating: number; title?: string; comment?: string }) =>
    apiRequest<{ message: string; review: any }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (reviewId: number, data: { rating: number; title?: string; comment?: string }) =>
    apiRequest<{ message: string; review: any }>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (reviewId: number) =>
    apiRequest<{ message: string }>(`/reviews/${reviewId}`, { method: 'DELETE' }),
};

// Coupons API
export const couponsApi = {
  getAll: () => apiRequest<{ data: any[] }>('/coupons'),

  validate: (code: string) => apiRequest<{ data: any }>(`/coupons/${code}`),
};

// Banners API
export const bannersApi = {
  getAll: (position?: string) => {
    const query = position ? `?position=${position}` : '';
    return apiRequest<{ data: any[] }>(`/banners${query}`);
  },

  getOne: (id: number | string) => apiRequest<{ data: any }>(`/banners/${id}`),
};

// Seller API
export const sellerApi = {
  register: (data: {
    store_name: string;
    store_description: string;
    business_type: string;
    address: string;
    city: string;
    country: string;
    phone: string;
    tax_id?: string;
    bank_name: string;
    bank_account: string;
  }) => apiRequest<{ message: string }>('/seller/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getStats: () => apiRequest<{ data: any }>('/seller/stats'),

  products: {
    getAll: (params?: { page?: number; per_page?: number; is_active?: boolean; is_approved?: boolean; low_stock?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiRequest<{ data: any[]; meta: any }>(`/seller/products${query ? `?${query}` : ''}`);
    },

    getOne: (id: number | string) => apiRequest<{ data: any }>(`/seller/products/${id}`),

    create: (data: any) => apiRequest<{ message: string; product: any }>('/seller/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id: number | string, data: any) =>
      apiRequest<{ message: string; product: any }>(`/seller/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number | string) =>
      apiRequest<{ message: string }>(`/seller/products/${id}`, { method: 'DELETE' }),
  },

  orders: {
    getAll: (params?: { page?: number; per_page?: number; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiRequest<{ data: any[]; meta: any }>(`/seller/orders${query ? `?${query}` : ''}`);
    },

    getOne: (id: number | string) => apiRequest<{ data: any }>(`/seller/orders/${id}`),

    updateStatus: (id: number | string, status: string) =>
      apiRequest<{ message: string; order: any }>(`/seller/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  payouts: {
    getAll: (params?: { page?: number; per_page?: number }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiRequest<{ data: any[]; meta: any }>(`/seller/payouts${query ? `?${query}` : ''}`);
    },

    request: (amount: number) =>
      apiRequest<{ message: string; payout: any }>('/seller/payouts', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
  },

  store: {
    get: () => apiRequest<{ data: any }>('/seller/store'),
    update: (data: any) =>
      apiRequest<{ message: string; store: any }>('/seller/store', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
};

// Admin API
export const adminApi = {
  users: {
    getAll: (params?: { page?: number; per_page?: number; role?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiRequest<{ data: any[]; meta: any }>(`/admin/users${query ? `?${query}` : ''}`);
    },

    getOne: (id: number | string) => apiRequest<{ data: any }>(`/admin/users/${id}`),

    create: (data: any) => apiRequest<{ message: string; user: any }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

    update: (id: number | string, data: any) =>
      apiRequest<{ message: string; user: any }>(`/admin/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    delete: (id: number | string) =>
      apiRequest<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),
  },

  orders: {
    getAll: (params?: { page?: number; per_page?: number; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) searchParams.append(key, String(value));
        });
      }
      const query = searchParams.toString();
      return apiRequest<{ data: any[]; meta: any }>(`/admin/orders${query ? `?${query}` : ''}`);
    },

    updateStatus: (id: number | string, status: string) =>
      apiRequest<{ message: string; order: any }>(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }),
  },

  categories: categoriesApi,
  products: productsApi,
  banners: bannersApi,
  coupons: couponsApi,
};

export default {
  auth: authApi,
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  wishlist: wishlistApi,
  orders: ordersApi,
  reviews: reviewsApi,
  coupons: couponsApi,
  banners: bannersApi,
  admin: adminApi,
};
