import useSWR from "swr";
import fetcher from "./fetcher";

export function useUser(token: string) {
	const { data, error, mutate, isLoading } = useSWR("user", (url) =>
		fetcher(url, token)
	);

	return {
		user: data,
		revalid: mutate,
		isLoading,
		isError: error,
	};
}
