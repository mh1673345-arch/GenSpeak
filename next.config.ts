import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/term/:slug",
        destination: "/meaning/:slug",
        permanent: true,
      },
      {
        source: "/word/:slug",
        destination: "/meaning/:slug",
        permanent: true,
      },
      {
        source: "/categories/:slug",
        destination: "/category/:slug",
        permanent: true,
      },
      {
        source: "/internet-culture/:topic*",
        destination: "/culture/:topic*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
