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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  experimental: {
    // Remove nextScriptWorkers as it's unstable
    optimisticClientCache: false,
    optimizeCss: true,
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            // More conservative caching strategy
            value:
              "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
          },
        ],
      },
    ];
  },
  // Error handling through proper logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
