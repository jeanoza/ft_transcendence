import useSWR from "swr";
import fetcher from "../fetcher";
import Router from "next/router";

export function useUser() {
	const { data, error, mutate, isLoading } = useSWR("user/current", fetcher, {
		onError: (e) => {
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
export function useUserById(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(`user/${userId}`, fetcher, {
		onError: (e) => {
			console.log("userId", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `user/${userId}`) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		userData: data,
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

export function useAllFriend() {
	const { data, error, mutate, isLoading } = useSWR("friend", fetcher, {
		onError: (e) => {
			//Router.push("/auth");
			console.log("userAllFriend", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "friend") return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		friends: data,
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
