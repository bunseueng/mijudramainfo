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
  },
  experimental: {
    nextScriptWorkers: true,
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
            key: "cache-control",
            value: "s-maxage=600, stale-while-revalidate=30",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
