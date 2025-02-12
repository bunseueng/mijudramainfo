import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/privacy", "/setting", "/friends", "/friends/request", "/notifications", "/lists"],
      },
    ],
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  }
}

