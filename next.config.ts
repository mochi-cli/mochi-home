import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The hero demo asks Claude to generate product cover images; the thumbnails
  // that land in the grid are seeded placeholder photography, not real assets.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  // From the account service: nothing here is worth advertising a framework for.
  poweredByHeader: false,
};

export default nextConfig;
