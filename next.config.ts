import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  reactCompiler: true,

  transpilePackages: ["@mui/material", "@mui/icons-material", "@mui/lab"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.omnixys.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
