export function Layout({ children }: React.PropsWithChildren) {
	return (
		<div>
			<div className="container">{children}</div>
			<style jsx global>{`
				main {
					width: 50%;
					min-width: 400px;
					margin: auto;
				}
			`}</style>
		</div>
	);
}
export function getServerSideProps({ req }: any) {
	const accessToken = req.cookies["accessToken"] || null
	if (!accessToken)
		return {
			redirect: {
				permanent: false,
				destination: "/auth",
			},
			props: {},
		};
	return { props: { accessToken } }
}