// Resolve Backend API Base URL dynamically:
// 1. Explicit environment variable: VITE_API_URL (e.g. http://192.168.1.21:5000 for Android or http://localhost:5000 for web)
// 2. Fallback to '/api' for standard browser Vite development proxy
const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const normalizedUrl = rawApiUrl ? rawApiUrl.replace(/\/+$/, '') : '';

export const API_BASE = normalizedUrl
  ? (normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`)
  : '/api';

export function getBackendBaseUrl(): string {
  if (normalizedUrl) {
    return normalizedUrl.replace(/\/api$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'http://localhost:5000';
}

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = getBackendBaseUrl();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('krishi_token');
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem('krishi_token', token);
  } else {
    localStorage.removeItem('krishi_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set JSON content-type unless sending FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (credentials: { emailOrPhone: string; password: string }) =>
      request<{ success: boolean; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (details: any) =>
      request<{ success: boolean; token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details)
      }),
    getMe: () => request<{ success: boolean; user: any; profile: any }>('/auth/me'),
    onboarding: (data: any) =>
      request<{ success: boolean; user: any }>('/auth/onboarding', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    forgotPassword: (emailOrPhone: string) =>
      request<{ success: boolean; message: string; demoToken?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone })
      }),
    resetPassword: (payload: { emailOrPhone: string; resetToken: string; newPassword: string }) =>
      request<{ success: boolean; message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },
  weather: {
    getCurrent: (params?: { location?: string; lat?: number; lon?: number }) => {
      const q = new URLSearchParams();
      if (params?.location) q.set('location', params.location);
      if (params?.lat) q.set('lat', params.lat.toString());
      if (params?.lon) q.set('lon', params.lon.toString());
      return request<{ success: boolean; weather: any }>(`/weather/current?${q.toString()}`);
    },
    getLocations: () => request<{ success: boolean; locations: any[] }>('/weather/locations')
  },
  disease: {
    analyze: (data: FormData | { cropHint?: string; language?: string; imageBase64?: string }) => {
      if (data instanceof FormData) {
        return request<{ success: boolean; analysis: any; providerUsed: string; message?: string; needs_better_image?: boolean; issue_type?: string }>('/disease/analyze', {
          method: 'POST',
          body: data
        });
      }
      return request<{ success: boolean; analysis: any; providerUsed: string; message?: string; needs_better_image?: boolean; issue_type?: string }>('/disease/analyze', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    getHistory: () => request<{ success: boolean; history: any[] }>('/disease/history'),
    getById: (id: string) => request<{ success: boolean; analysis: any }>(`/disease/${id}`)
  },
  crops: {
    getAll: () => request<{ success: boolean; crops: any[] }>('/crops'),
    getById: (id: string) => request<{ success: boolean; crop: any; knowledge: any; commonDiseases: any[] }>(`/crops/${id}`),
    create: (data: any) =>
      request<{ success: boolean; crop: any }>('/crops', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean; crop: any }>(`/crops/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/crops/${id}`, {
        method: 'DELETE'
      }),
    getSupported: () => request<{ success: boolean; supportedCrops: any[] }>('/crops/meta/supported')
  },
  irrigation: {
    calculate: (data: any) =>
      request<{ success: boolean; recommendation: any }>('/irrigation/calculate', {
        method: 'POST',
        body: JSON.stringify(data)
      })
  },
  advisor: {
    getDaily: (location?: string, lang?: string) => {
      const q = new URLSearchParams();
      if (location) q.set('location', location);
      if (lang) q.set('lang', lang);
      return request<{ success: boolean; advisory: any; weather: any; cropCount: number }>(`/advisor/daily?${q.toString()}`);
    },
    chat: (payload: { message: string; history?: any[]; language?: string; location?: string; crop?: string }) =>
      request<{ success: boolean; reply: string; providerUsed: string }>('/advisor/chat', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
  },
  alerts: {
    getAll: (location?: string, lang?: string) => {
      const q = new URLSearchParams();
      if (location) q.set('location', location);
      if (lang) q.set('lang', lang);
      return request<{ success: boolean; alerts: any[] }>(`/alerts?${q.toString()}`);
    },
    markRead: (id: string) =>
      request<{ success: boolean; message: string }>(`/alerts/${id}/read`, {
        method: 'PUT'
      })
  },
  profile: {
    get: () => request<{ success: boolean; user: any; profile: any }>('/profile'),
    update: (data: any) =>
      request<{ success: boolean; user: any; profile: any }>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    updateLanguage: (language: string) =>
      request<{ success: boolean; language: string }>('/profile/language', {
        method: 'POST',
        body: JSON.stringify({ language })
      })
  }
};
