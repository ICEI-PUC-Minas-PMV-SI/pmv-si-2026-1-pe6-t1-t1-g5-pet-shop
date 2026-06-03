import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { storage } from './storage';

function translateError(msg: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha inválidos.',
    'User already registered': 'Usuário já cadastrado.',
    'User not found': 'Usuário não encontrado.',
    'Scheduling not found': 'Agendamento não encontrado.',
    'id path param is required': 'O identificador do agendamento é obrigatório.',
    'dateTime must be a valid date': 'Data e hora inválidas para o agendamento.',
    'totalValue must be a number greater than or equal to zero':
      'O valor total do agendamento deve ser maior ou igual a zero.',
    'fetch failed': 'Erro de conexão. Verifique sua internet.',
    'Network request failed': 'Erro de conexão. Verifique sua internet.',
  };
  return translations[msg] || msg;
}

export async function publicRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro de conexão';
    throw new Error(translateError(msg));
  }

  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(translateError(data.error || 'Erro inesperado'));
  }

  return data as T;
}

export async function authRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const token = await storage.get(STORAGE_KEYS.TOKEN);
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro de conexão';
    throw new Error(translateError(msg));
  }

  if (response.status === 204) return null as T;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(translateError(data.error || data.message || 'Erro inesperado'));
  }

  return data as T;
}
