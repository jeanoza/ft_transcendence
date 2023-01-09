/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/oauth/authorize",
				destination:
					"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8271f49958d5c55f85f7ddca4ceb5b16a3aa3715e29a0f4f77913d1dd0b88eb3&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code",
			},
		];
	},
};

module.exports = nextConfig;
