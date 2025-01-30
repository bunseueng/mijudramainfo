// pages/api/pipeline.ts
import { NextApiRequest, NextApiResponse } from "next";
import redis from "@/lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { key, value } = req.body;

  try {
    // Set data in Redis
    await redis.set(key, value);

    // Get data from Redis
    const storedValue = await redis.get(key);

    res.status(200).json({ message: "Data saved successfully", storedValue });
  } catch (error) {
    console.error("Redis error:", error);
    res.status(500).json({ message: "Failed to save data" });
  }
}