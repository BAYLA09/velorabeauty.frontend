import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["better-sqlite3"],
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 828, 1200],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/products/:file*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
      {
        source: "/videos/:path*.mp4",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/magnific_animate-into-a-5second-photorealistic-lifestyle-cl_kling_720p_9-16_24fps_31067.mp4",
        destination:
          "/videos/stories/skin-gummies/magnific_animate-into-a-5second-photorealistic-lifestyle-cl_kling_720p_9-16_24fps_31067.mp4",
        permanent: true,
      },
      {
        source: "/products/eye-gummies",
        destination: "/products/eye-serum",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
