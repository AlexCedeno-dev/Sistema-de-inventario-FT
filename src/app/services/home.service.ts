import type {
  HomeAlerta,
  HomeActividad,
  HomeReciente,
  HomeResumen,
} from '../../types/home.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error ${response.status}: ${text}`);
  }

  return response.json();
}

export function getHomeResumen(): Promise<HomeResumen> {
  return request<HomeResumen>('/home/resumen');
}

export function getHomeAlertas(): Promise<HomeAlerta[]> {
  return request<HomeAlerta[]>('/home/alertas');
}

export function getHomeActividad(): Promise<HomeActividad> {
  return request<HomeActividad>('/home/actividad');
}

export function getHomeRecientes(): Promise<HomeReciente[]> {
  return request<HomeReciente[]>('/home/recientes');
}