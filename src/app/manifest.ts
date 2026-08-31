import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mochi · Your team's data workspace",
    short_name: "Mochi",
    description:
      "Build a CRM, HR tracker, or any internal tool. No code, no prompts, no monthly server fees.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f0",
    theme_color: "#131313",
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
