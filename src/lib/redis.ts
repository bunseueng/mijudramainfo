import { Redis } from '@upstash/redis';

// Initialize Redis using credentials from environment variables
const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
});
export default redis;