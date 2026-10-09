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
      {
        source: "/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_1080p_9-16_24fps_21720.mp4",
        destination:
          "/videos/stories/hair-gummies/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_1080p_9-16_24fps_21720.mp4",
        permanent: true,
      },
      {
        source: "/magnific_create-a-5second-photorealistic-video-from-the-pro_kling_720p_9-16_24fps_21719.mp4",
        destination:
          "/videos/stories/hair-gummies/magnific_create-a-5second-photorealistic-video-from-the-pro_kling_720p_9-16_24fps_21719.mp4",
        permanent: true,
      },
      {
        source: "/magnific_create-a-realistic-5second-ugc-video-from-this-ima_kling_720p_9-16_24fps_21717.mp4",
        destination:
          "/videos/stories/hair-gummies/magnific_create-a-realistic-5second-ugc-video-from-this-ima_kling_720p_9-16_24fps_21717.mp4",
        permanent: true,
      },
      {
        source: "/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_720p_9-16_24fps_21716.mp4",
        destination:
          "/videos/stories/hair-gummies/magnific_animate-the-provided-image-into-a-5second-ultrarea_kling_720p_9-16_24fps_21716.mp4",
        permanent: true,
      },
      {
        source: "/magnific_animate-this-image-into-a-6second-realistic-lifest_kling_720p_9-16_24fps_21718.mp4",
        destination:
          "/videos/stories/hair-gummies/magnific_animate-this-image-into-a-6second-realistic-lifest_kling_720p_9-16_24fps_21718.mp4",
        permanent: true,
      },
      {
        source: "/videos/stories/magnific_create-a-5second-ultrarealistic-beauty-ugc-video-u_kling_720p_9-16_24fps_21725.mp4",
        destination:
          "/videos/stories/eye-serum/magnific_create-a-5second-ultrarealistic-beauty-ugc-video-u_kling_720p_9-16_24fps_21725.mp4",
        permanent: true,
      },
      {
        source: "/videos/stories/magnific_create-a-5second-ultrarealistic-skincare-video-usi_kling_720p_9-16_24fps_21727.mp4",
        destination:
          "/videos/stories/eye-serum/magnific_create-a-5second-ultrarealistic-skincare-video-usi_kling_720p_9-16_24fps_21727.mp4",
        permanent: true,
      },
      {
        source: "/videos/stories/magnific_create-a-5second-ultrarealistic-vertical-916-skinc_kling_720p_9-16_24fps_21728.mp4",
        destination:
          "/videos/stories/eye-serum/magnific_create-a-5second-ultrarealistic-vertical-916-skinc_kling_720p_9-16_24fps_21728.mp4",
        permanent: true,
      },
      {
        source: "/videos/stories/magnific_create-a-5second-ultrarealistic-smartphone-video-f_kling_720p_9-16_24fps_21724.mp4",
        destination:
          "/videos/stories/eye-serum/magnific_create-a-5second-ultrarealistic-smartphone-video-f_kling_720p_9-16_24fps_21724.mp4",
        permanent: true,
      },
      {
        source: "/videos/stories/magnific_create-a-realistic-5second-vertical-916-skincare-a_kling_720p_9-16_24fps_21726.mp4",
        destination:
          "/videos/stories/eye-serum/magnific_create-a-realistic-5second-vertical-916-skincare-a_kling_720p_9-16_24fps_21726.mp4",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
