import type { NextConfig } from "next";

const configuredApiUrl = process.env.NEXT_PUBLIC_PROXY_URL?.replace(/\/+$/, "") ?? "http://localhost:8000";
const apiBaseUrl = configuredApiUrl.endsWith("/api/v1") ? configuredApiUrl : `${configuredApiUrl}/api/v1`;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    instantInsights: {
      // 수강자·강사·운영자·온보딩 화면은 토큰이 브라우저 저장소에만 있어 AuthGuard가 클라이언트에서 확인한다.
      // 서버 렌더에서는 페이지를 그리지 않으므로, 모든 페이지를 자동 검증하지 않고 instant를 직접 지정한 구간만 검증한다.
      validationLevel: "manual-warning",
    },
  },
  async rewrites() {
    return [{ source: "/api/v1/:path*", destination: `${apiBaseUrl}/:path*` }];
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
