// @ts-check
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();

const path = require("node:path");
require('dotenv').config({path: path.resolve(process.env.ROOT_DIR || process.cwd(), '.env')});

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.telegram.org',
                pathname: '/file/bot**/**',
            },
        ],
    },
    output: 'standalone',
    webpack: (config, {nextRuntime}) => {
        if (nextRuntime === 'edge' && process.env.NODE_ENV !== 'production') {
            const plugin = require('next/dist/compiled/webpack/webpack').webpack.DefinePlugin;
            config.plugins.push(
                new plugin({
                    'process.env.SESSION_KEY': `"${process.env.SESSION_KEY}"`,
                })
            );
        }

        const rules = config.module.rules
            .find((rule) => typeof rule.oneOf === "object")
            .oneOf.filter((rule) => Array.isArray(rule.use));
        rules.forEach((rule) => {
            rule.use.forEach((moduleLoader) => {
                if (
                    moduleLoader.loader !== undefined &&
                    moduleLoader.loader.includes("css-loader") &&
                    typeof moduleLoader.options.modules === "object"
                ) {
                    moduleLoader.options = {
                        ...moduleLoader.options,
                        modules: {
                            ...moduleLoader.options.modules,
                            // This is where we allow camelCase class names
                            exportLocalsConvention: "camelCase",
                        },
                    };
                }
            });
        });

        return config;
    },
};

module.exports = withNextIntl(nextConfig);