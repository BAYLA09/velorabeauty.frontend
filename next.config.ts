import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/products/eye-gummies",
        destination: "/products/eye-serum",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
