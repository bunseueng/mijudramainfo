/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "image.tmdb.org",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "res.cloudinary.com",
      "img.alicdn.com",
      "v.qq.com",
      "static.hitv.com",
      "encrypted-tbn0.gstatic.com",
      "www.iq.com",
      "upload.wikimedia.org",
      "static.wikia.nocookie.net",
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    nextScriptWorkers: true,
    optimisticClientCache: false,
    optimizeCss: true,
  },
  reactStrictMode: true,
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "cache-control",
            value: "s-maxage=600, stale-while-revalidate=30",
          },
        ],
      },
    ];
  },
  onError: (error) => {
    console.error("Next.js build error:", error);
  },
};

export default nextConfig;
