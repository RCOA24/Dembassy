import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const config = (phase: string): NextConfig => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(phase === PHASE_DEVELOPMENT_SERVER && {
    async rewrites() {
      return {
        beforeFiles: [{ source: "/api/appointment.php", destination: "http://127.0.0.1:8000/api/appointment.php" }],
      };
    },
  }),
});
export default config;
