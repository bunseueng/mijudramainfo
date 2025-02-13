import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/privacy",
          "/setting",
          "/friends",
          "/friends/request",
          "/notifications",
          "/lists",
          "/tv/*/edit", // This is the corrected line
          "/movie/*/edit", // This is the corrected line
          "/person/*/edit", // This is the corrected line
        ],
      },
    ],
    sitemap: `${process.env.BASE_URL}/sitemap.xml`,
  }
}

