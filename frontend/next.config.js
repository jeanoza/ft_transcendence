/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		//console.log(process.env.AUTH42_AUTH_URL);
		return [
			{
				source: "/auth42",
				destination: process.env.AUTH42_AUTH_URL,
			},
		];
	},
};

module.exports = nextConfig;
