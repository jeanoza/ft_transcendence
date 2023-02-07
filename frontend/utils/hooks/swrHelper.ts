import useSWR from "swr";
import fetcher from "../fetcher";
import Router from "next/router";

export function useUser() {
	const { data, error, mutate, isLoading } = useSWR("user/current", fetcher, {
		onError: () => {
			Router.push("/auth");
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "user/current") return;

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
		//onSuccess: () => {
		//	if (Router.pathname === "/_2fa") Router.push("/");
		//},
		onError: () => {
			Router.push("/_2fa");
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "2fa") return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		is2faAuthed: data,
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
