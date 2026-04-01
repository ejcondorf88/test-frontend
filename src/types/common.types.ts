/**
 * Common Types
 * Shared types across the application
 */

// API Response types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  status: number
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Common entity types
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

export interface User extends BaseEntity {
  email: string
  name: string
  role: 'admin' | 'user' | 'moderator'
  avatar?: string
  isActive: boolean
}

// Form types
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  status: FormStatus
}
