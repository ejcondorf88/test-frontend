/**
 * API Configuration
 * Centralized configuration for Axios and API endpoints
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  CREDIT_CARDS: '/credit-cards',
} as const
