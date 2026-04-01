/**
 * Common Utility Functions
 */

/**
 * Formats a date to a readable string
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Formats a number as currency (default USD)
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Generates a unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clones an object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Debounces a function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Throttles a function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Validates an email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Truncates text to a maximum length
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Groups an array by a key
 */
export const groupBy = <T, K extends keyof T>(arr: T[], key: K): Record<string, T[]> => {
  return arr.reduce((groups, item) => {
    const groupKey = String(item[key])
    return {
      ...groups,
      [groupKey]: [...(groups[groupKey] || []), item],
    }
  }, {} as Record<string, T[]>)
}

/**
 * Sorts an array by a key
 */
export const sortBy = <T, K extends keyof T>(
  arr: T[],
  key: K,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1
    if (aVal > bVal) return order === 'asc' ? 1 : -1
    return 0
  })
}
