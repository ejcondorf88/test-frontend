/**
 * API Configuration
 * Centralized configuration for Axios and API endpoints
 */

// Development: Spring Boot running on port 8080
// Production (Docker): goes through nginx proxy at /api/
const getBaseUrl = (): string => {
  if (import.meta.env.PROD) {
    // Production Docker: use relative path through nginx proxy
    return '/api/v1'
  }
  // Development: direct connection to backend
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
}

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 30000,
} as const

export const API_ENDPOINTS = {
  CREDIT_CARDS: '/credit-cards',
} as const
