import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/onboarding/"],
    },
    sitemap: "https://homecareleads.com/sitemap.xml",
  };
}
