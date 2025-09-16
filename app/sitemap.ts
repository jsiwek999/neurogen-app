import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://emxprotocol.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://emxprotocol.com/start-here", changeFrequency: "monthly" },
    { url: "https://emxprotocol.com/rituals", changeFrequency: "monthly" },
    { url: "https://emxprotocol.com/blog", changeFrequency: "weekly" },
    { url: "https://emxprotocol.com/privacy", changeFrequency: "yearly" },
    { url: "https://emxprotocol.com/terms", changeFrequency: "yearly" },
  ];
}
