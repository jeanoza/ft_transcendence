import useSWR from "swr";
import fetcher from "../fetcher";
import Router from "next/router";

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

export function useAllUser() {
	const { data, error, mutate, isLoading } = useSWR(`user`, fetcher, {
		onError: (e) => {
			console.log("useAllUser", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `user`) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		users: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useFriend(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(
		`friend/${userId}`,
		fetcher,
		{
			onError: (e) => {
				console.log("useFriend", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `friend/${userId}`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		friend: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllFriend() {
	const { data, error, mutate, isLoading } = useSWR("friend", fetcher, {
		onError: (e) => {
			console.log("useAllFriend", e);
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

export function useBlocked(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(
		`blocked/${userId}`,
		fetcher,
		{
			onError: (e) => {
				console.log("useBlocked", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `blocked/${userId}`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		blocked: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllBlocked() {
	const { data, error, mutate, isLoading } = useSWR("blocked", fetcher, {
		onError: (e) => {
			console.log("userAllBlocked", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === "blocked") return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		blockeds: data,
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

export function useAllChannelByUserId(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${userId}`,
		fetcher,
		{
			onError: (e) => {
				console.log("useAllChannel", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `channel/${userId}`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		channels: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllDmByUserId(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(`dm/${userId}`, fetcher, {
		onError: (e) => {
			console.log("useAllDm", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `dm/${userId}`) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		dms: data,
		revalid: mutate,
		isLoading,
		error,
	};
}
