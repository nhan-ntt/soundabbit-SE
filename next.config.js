/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'drive.google.com',
            },
        ],
        domains: ["drive.google.com", "images.unsplash.com", "s3.us-west-2.amazonaws.com"]
    },

    compiler: {
        styledComponents: true,
    },
    env: {
        RHYME_API_URL: process.env.RHYME_API_URL,
        ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
        ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    },
};
