import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        turbo: {
            rules: {
                "*.glsl": {
                    loaders: ['raw-loader'],
                    as: "*.js"
                }
            }
        }
    },
    webpack: (config, context) => {
        config.module.rules.push({
            test: /\.glsl/,
            use: [
                context.defaultLoaders.babel,
                {
                    loader: "raw-loader"
                }
            ]
        })
        return config
    }
};

export default nextConfig;
