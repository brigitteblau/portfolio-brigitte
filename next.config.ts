import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Los escritos ahora viven en el journal (una sola dirección para Google)
  async redirects() {
    return [{ source: "/:lang(es|en)/escritos/:slug", destination: "/:lang/journal/:slug", permanent: true }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
