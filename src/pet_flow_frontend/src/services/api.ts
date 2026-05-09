const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  'https://pmv-si-2026-1-pe6-t1-t1-g5-pet-shop.onrender.com/api/v1';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface AuthResponse {
  user_id: string;
  token: string;
  refresh_token: string;
  clinic_id?: string; // Adicionado para suportar o vínculo com a clínica
}

interface ApiError {
  error: string;
}

// ─── Helper de Requisição ─────────────────────────────────────────────────────

async function request<T>(endpoint: string, options: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Tratamento para respostas sem corpo (ex: 204 No Content)
  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error((data as ApiError).error || 'Erro inesperado');
  }

  return data as T;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Realiza o login do usuário
   */
  login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Registra um novo usuário e clínica.
   * Recebe um objeto com: email, password, name, clinic_name, cnpj, etc.
   */
  register(payload: Record<string, any>): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Atualiza o token de acesso usando o refresh token
   */
  refresh(refreshToken: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};