/**
 * Debounce function to limit function calls during rapid events
 * Useful for search inputs, window resizing, etc.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

/**
 * Throttle function to limit function calls at set intervals
 * Useful for scroll events, drag events, etc.
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Batch requests to reduce API calls
 * Collects multiple requests within a time window and batches them
 */
export function createBatcher<TInput, TOutput>(batchFn: (items: TInput[]) => Promise<TOutput[]>, delayMs = 50) {
  let queue: { input: TInput; resolve: (output: TOutput) => void; reject: (error: Error) => void }[] = []
  let timeoutId: NodeJS.Timeout | null = null

  const processBatch = async () => {
    if (queue.length === 0) return

    const batch = queue
    queue = []

    try {
      const results = await batchFn(batch.map((item) => item.input))
      batch.forEach((item, index) => {
        item.resolve(results[index])
      })
    } catch (error) {
      batch.forEach((item) => {
        item.reject(error as Error)
      })
    }
  }

  return {
    add(input: TInput): Promise<TOutput> {
      return new Promise((resolve, reject) => {
        queue.push({ input, resolve, reject })

        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(processBatch, delayMs)
      })
    },

    flush() {
      if (timeoutId) clearTimeout(timeoutId)
      return processBatch()
    },
  }
}

/**
 * Memoize function results based on arguments
 * Caches function results to avoid redundant calculations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T, options?: { maxSize?: number }): T {
  const cache = new Map()
  const maxSize = options?.maxSize ?? 100

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args)
    cache.set(key, result)

    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }

    return result
  }) as T
}
