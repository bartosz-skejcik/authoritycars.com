import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    typescript: {
        ignoreBuildErrors: true,
    },
    async redirects() {
        return [
            {
                source: "/register",
                destination: "/",
                permament: true,
            },
        ];
    },
};

export default nextConfig;
