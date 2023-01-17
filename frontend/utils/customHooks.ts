import useSWR from "swr";
import fetcher from "./fetcher";

export function useUser() {
	const { data, error, mutate, isLoading } = useSWR(`/user`, fetcher);

	return {
		user: data,
		revalid: mutate,
		isLoading,
		isError: error,
	};
}
