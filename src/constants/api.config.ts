/**
 * API Configuration
 * 
 * Puerto 9000 - Credit Card Service (tarjetas)
 * Puerto 9092 - Credit Card Service (operaciones/active)
 */

const isDev = import.meta.env.DEV

// Credit Card Service - puerto 9000 (tarjetas)
export const CREDIT_CARD_API = {
  BASE_URL: isDev ? '/api/v1' : '/api/v1',
  TIMEOUT: 30000,
}

// Operations API - puerto 9092 (tarjetas activas)
export const OPERATIONS_API = {
  BASE_URL: isDev ? '/operations-api' : '/operations-api',
  TIMEOUT: 30000,
}

// Legacy support
export const API_CONFIG = {
  BASE_URL: '',
  TIMEOUT: 30000,
} as const