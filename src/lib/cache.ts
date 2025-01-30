import { Redis } from "@upstash/redis"

// Initialize Redis client
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
})

interface CacheItem<T> {
  data: T
  expiresAt: number
}

const inFlightPromises: Record<string, Promise<any>> = {}

export async function withCache<T>(
  fetchFunction: () => Promise<T>,
  cacheKey: string,
  ttlSeconds = 120,
  staleWhileRevalidateSeconds = 600,
): Promise<T> {
  try {
    // Check if there's an in-flight promise for this key
    if (await inFlightPromises[cacheKey]) {
      return await inFlightPromises[cacheKey]
    }

    const cachedItem = await redis.get<CacheItem<T>>(cacheKey)

    if (cachedItem) {
      const now = Date.now()
      if (now < cachedItem.expiresAt) {
        // Cache hit and not expired
        return cachedItem.data
      } else if (now < cachedItem.expiresAt + staleWhileRevalidateSeconds * 1000) {
        // Stale but still usable, revalidate in background
        revalidateCache(fetchFunction, cacheKey, ttlSeconds)
        return cachedItem.data
      }
    }

    // Cache miss or expired, fetch fresh data
    return await fetchFreshData(fetchFunction, cacheKey, ttlSeconds)
  } catch (error) {
    // On cache error, fall back to fetch function but don't cache the result
    return await fetchFunction()
  }
}

async function fetchFreshData<T>(fetchFunction: () => Promise<T>, cacheKey: string, ttlSeconds: number): Promise<T> {
  // Create a new promise for this fetch
  inFlightPromises[cacheKey] = (async () => {
    try {
      const freshData = await fetchFunction()
      const cacheItem: CacheItem<T> = {
        data: freshData,
        expiresAt: Date.now() + ttlSeconds * 1000,
      }
      await redis.set(cacheKey, cacheItem)
      return freshData
    } finally {
      // Clean up the in-flight promise
      delete inFlightPromises[cacheKey]
    }
  })()

  return await inFlightPromises[cacheKey]
}

async function revalidateCache<T>(
  fetchFunction: () => Promise<T>,
  cacheKey: string,
  ttlSeconds: number,
): Promise<void> {
  try {
    const freshData = await fetchFunction()
    const cacheItem: CacheItem<T> = {
      data: freshData,
      expiresAt: Date.now() + ttlSeconds * 1000,
    }
    await redis.set(cacheKey, cacheItem)
  } catch (error) {
    console.error("Revalidation error:", error)
    // If revalidation fails, we don't update the cache
  }
}

