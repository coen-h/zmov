import withPWA from "next-pwa";
// @ts-ignore
import runtimeCaching from "next-pwa/cache";
import type { NextConfig } from "next";

const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async rewrites() {
    return [
      // let Next.js handle dynamic routes like /info/movie/:id
      {
        source: "/info/:type/:id",
        destination: "/info/:type/:id",
      },
      // fallback: everything else goes to homepage
      {
        source: "/:path*",
        destination: "/",
      },
    ];
  },
};

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching,
});

// @ts-ignore
export default withPWAConfig(baseConfig);