import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "agcl.space",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "pic.agcl.ink",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "steamcdn-a.akamaihd.net",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
