import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mochi · Your team's data workspace",
    short_name: "Mochi",
    description:
      "Build a customer list, a hiring tracker, anything your team needs. It all lives on your own computer.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6f6",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["productivity", "developer", "business"],
    lang: "en",
  };
}
