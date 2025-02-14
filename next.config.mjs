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
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  experimental: {
    optimisticClientCache: false,
    optimizeCss: true,
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        has: [
          {
            type: "header",
            key: "x-apply-cache",
            value: "(?!false)",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/tv/:id/edit//:path*", // Matches double slashes
        destination: "/tv/:id/edit/:path*", // Fixes double slashes
        permanent: true, // 301 Redirect
      },
      {
        source: "/movie/:id/edit//:path*", // Matches double slashes
        destination: "/movie/:id/edit/:path*", // Fixes double slashes
        permanent: true, // 301 Redirect
      },
      {
        source: "/person/:id/edit//:path*", // Matches double slashes
        destination: "/person/:id/edit/:path*", // Fixes double slashes
        permanent: true, // 301 Redirect
      },
    ];
  },
};

export default nextConfig;
