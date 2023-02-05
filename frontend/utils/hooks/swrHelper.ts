import useSWR from "swr";
import fetcher from "../fetcher";
import Router from "next/router";

export function useUser() {
	const { data, error, mutate, isLoading } = useSWR("user", fetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			//if (error?.response?.data?.message === "2fa") {
			//	Router.push("_2fa");
			//}
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "user") return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		user: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function use2fa() {
	const { data, error, mutate, isLoading } = useSWR("2fa", fetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			//if (error?.response?.data?.message === "2fa") {
			//	Router.push("_2fa");
			//}

			console.log("use 2fa", error);

			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "2fa") {
				return;
			}

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		user: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllNote() {
	const { data, error, mutate, isLoading } = useSWR("note", fetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "note") return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		notes: data,
		revalid: mutate,
		isLoading,
		error,
	};
}
