import { MetadataRoute } from "next";

export default function robots():MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                disallow: ["/privacy", "/setting", "/friends", "/friends/request"],
                allow: "/"
            }
        ],
        sitemap: `${process.env.BASE_URL}/sitemap.xml`
    }
}