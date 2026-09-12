// ========================================
// ASCEND — API Client
// Authenticated fetch wrapper for the FastAPI backend.
// Auto-attaches Supabase JWT as Bearer token.
// ========================================

import { supabase } from '../lib/supabase';

const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '');

/**
 * Core fetch wrapper that:
 * 1. Reads the current Supabase session
 * 2. Extracts the JWT access_token
 * 3. Attaches it as `Authorization: Bearer <token>`
 * 4. Sends the request to the FastAPI backend
 * 5. Parses JSON and throws on HTTP errors
 */
async function apiRequest(endpoint, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    const message = data?.detail || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ---- Convenience methods ----

export function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

export function apiPost(endpoint, body = undefined) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function apiPut(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

export function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

export default apiRequest;
