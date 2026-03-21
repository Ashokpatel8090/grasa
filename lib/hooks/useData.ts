'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, retryRequest, debounceAPI } from '@/lib/api-utils'

interface UseDataOptions {
  retry?: number
  revalidateInterval?: number
  shouldFetch?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  cache?: boolean
}

/**
 * Custom hook for fetching data with caching and error handling
 * Similar to SWR pattern for client-side data fetching
 */
export function useData<T>(
  url: string | null,
  options: UseDataOptions = {}
) {
  const {
    retry = 3,
    revalidateInterval = 0,
    shouldFetch = true,
    onSuccess,
    onError,
    cache = true,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchData = useCallback(async () => {
    if (!url || !shouldFetch) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await retryRequest(
        () => apiClient.get<T>(url, { useCache: cache }),
        retry
      )

      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [url, retry, cache, shouldFetch, onSuccess, onError])

  useEffect(() => {
    fetchData()

    if (revalidateInterval > 0) {
      intervalRef.current = setInterval(fetchData, revalidateInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      abortControllerRef.current?.abort()
    }
  }, [fetchData, revalidateInterval])

  const refetch = useCallback(() => {
    apiClient.clearCache(`GET:${url}`)
    fetchData()
  }, [url, fetchData])

  return {
    data,
    error,
    isLoading,
    refetch,
  }
}

/**
 * Custom hook for mutation operations (POST, PUT, DELETE, etc.)
 * Handles loading states, errors, and success callbacks
 */
export function useMutation<TRequest, TResponse>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: string,
  options: {
    onSuccess?: (data: TResponse) => void
    onError?: (error: Error) => void
  } = {}
) {
  const { onSuccess, onError } = options

  const [data, setData] = useState<TResponse | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (payload?: TRequest) => {
      setIsLoading(true)
      setError(null)

      try {
        let result: TResponse

        switch (method) {
          case 'POST':
            result = await apiClient.post<TResponse>(url, payload)
            break
          case 'PUT':
            result = await apiClient.put<TResponse>(url, payload)
            break
          case 'PATCH':
            result = await apiClient.patch<TResponse>(url, payload)
            break
          case 'DELETE':
            result = await apiClient.delete<TResponse>(url)
            break
        }

        setData(result)
        onSuccess?.(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [method, url, onSuccess, onError]
  )

  return {
    mutate,
    data,
    error,
    isLoading,
  }
}

/**
 * Custom hook for paginated data fetching
 * Handles pagination state and navigation
 */
interface UsePaginationOptions extends Omit<UseDataOptions, 'shouldFetch'> {
  pageSize?: number
}

export function usePagination<T>(
  baseUrl: string,
  options: UsePaginationOptions = {}
) {
  const { pageSize = 10, ...dataOptions } = options

  const [page, setPage] = useState(1)

  const url = `${baseUrl}?page=${page}&limit=${pageSize}`
  const { data, error, isLoading, refetch } = useData<{
    items: T[]
    total: number
    pages: number
    currentPage: number
  }>(url, dataOptions)

  const nextPage = useCallback(() => {
    if (data && page < data.pages) {
      setPage(page + 1)
    }
  }, [data, page])

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const goToPage = useCallback((newPage: number) => {
    setPage(Math.max(1, newPage))
  }, [])

  return {
    items: data?.items || [],
    total: data?.total || 0,
    pages: data?.pages || 0,
    currentPage: data?.currentPage || page,
    isLoading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  }
}

/**
 * Custom hook for debounced search
 * Useful for search inputs with API calls
 */
export function useDebouncedSearch<T>(
  searchUrl: string,
  delay: number = 300
) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearch = useCallback(
    debounceAPI(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await apiClient.get<T[]>(
          `${searchUrl}?q=${encodeURIComponent(searchQuery)}`
        )
        setResults(data)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }, delay),
    [searchUrl, delay]
  )

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      debouncedSearch(value)
    },
    [debouncedSearch]
  )

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    setQuery,
  }
}

/**
 * Custom hook for managing form state with validation
 * Handles form values, errors, and submission
 */
interface FormErrors {
  [key: string]: string
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: (values: T) => FormErrors
) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target

      setValues(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }))

      // Clear error for this field when user starts typing
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }))
      }
    },
    [errors]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target
      setTouched(prev => ({
        ...prev,
        [name]: true,
      }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate form
      if (validate) {
        const newErrors = validate(values)
        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
          return
        }
      }

      setIsSubmitting(true)

      try {
        await onSubmit(values)
      } catch (error) {
        const err = error instanceof Error ? error.message : 'Form submission failed'
        setErrors(prev => ({
          ...prev,
          submit: err,
        }))
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, validate, onSubmit]
  )

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  }
}
