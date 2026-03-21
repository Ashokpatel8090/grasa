/**
 * API Utilities for enhanced data fetching and error handling
 * Provides consistent API call patterns, caching, and error management
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

type CacheEntry<T> = {
  data: T
  timestamp: number
}

class APIClient {
  private axiosInstance: AxiosInstance
  private cache: Map<string, CacheEntry<any>> = new Map()
  private cacheTimeout: number = 5 * 60 * 1000 // 5 minutes default

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    )
  }

  /**
   * GET request with optional caching
   */
  async get<T>(url: string, config?: AxiosRequestConfig & { useCache?: boolean; cacheTime?: number }) {
    const cacheKey = `GET:${url}`
    const { useCache = false, cacheTime = this.cacheTimeout, ...axiosConfig } = config || {}

    // Check cache
    if (useCache) {
      const cachedData = this.getFromCache<T>(cacheKey)
      if (cachedData) return cachedData
    }

    try {
      const response = await this.axiosInstance.get<T>(url, axiosConfig)
      
      // Store in cache if requested
      if (useCache) {
        this.setCache(cacheKey, response.data, cacheTime)
      }

      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * POST request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * PUT request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.axiosInstance.delete<T>(url, config)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Cache management methods
   */
  private setCache<T>(key: string, data: T, timeout: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + timeout
    })
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  /**
   * Error handling
   */
  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError

      // Network error
      if (!axiosError.response) {
        return new Error('Network error. Please check your connection.')
      }

      // Server error
      const status = axiosError.response.status
      const data = axiosError.response.data as any

      switch (status) {
        case 400:
          return new Error(data?.message || 'Bad request')
        case 401:
          return new Error('Unauthorized. Please login again.')
        case 403:
          return new Error('Access forbidden.')
        case 404:
          return new Error('Resource not found.')
        case 429:
          return new Error('Too many requests. Please try again later.')
        case 500:
        case 502:
        case 503:
          return new Error('Server error. Please try again later.')
        default:
          return new Error(data?.message || `Error: ${status}`)
      }
    }

    return error instanceof Error ? error : new Error('An unknown error occurred')
  }
}

// Export singleton instance
export const apiClient = new APIClient()

/**
 * Retry logic for failed requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

/**
 * Debounced API calls
 */
export function debounceAPI<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout

  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, delay)
    })
  }
}

/**
 * Abort controller for cancelling requests
 */
export function createAbortController() {
  return new AbortController()
}
