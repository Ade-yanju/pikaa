import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Don't advertise the framework to attackers.
  poweredByHeader: false,
  // Pin the workspace root — a parent-directory lockfile otherwise makes
  // Next infer the wrong root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Security hardening against common attacks (clickjacking, MIME sniffing,
  // protocol downgrade, referrer/permission leakage).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
