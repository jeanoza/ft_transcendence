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

export function useAllChannel() {
	const { data, error, mutate, isLoading } = useSWR(`channel`, fetcher, {
		onError: (e) => {
			console.log("useAllChannel", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `channel`) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		channels: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllPublicChannel() {
	const { data, error, mutate, isLoading } = useSWR(`channel/public`, fetcher, {
		onError: (e) => {
			console.log("useAllPublicChannel", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `channel/public`) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		publicChannels: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllUsersInChannel(channelName: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${channelName}/user`,
		fetcher,
		{
			onError: (e) => {
				console.log("useAllUsersInChannel", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `channel`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		users: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useChannel(channel: number | string) {
	let query = "channel?";
	if (typeof channel === "number") query += `id=${channel}`;
	else query += `name=${channel}`;
	const { data, error, mutate, isLoading } = useSWR(query, fetcher, {
		onError: (e) => {
			console.log("useChannel", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === query) return;

			// Only retry up to 10 times.
			if (retryCount >= 10) return;

			// Retry after 5 seconds.
			setTimeout(() => revalidate({ retryCount }), 5000);
		},
	});
	return {
		channel: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useIsOwner(channel: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${channel}/is_owner`,
		fetcher,
		{
			onError: (e) => {
				console.log("useIsOwner", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `${channel}/is_owner`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		isOwner: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useIsAdmin(channel: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${channel}/is_admin`,
		fetcher,
		{
			onError: (e) => {
				console.log("useIsAdmin", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `${channel}/is_admin`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		isAdmin: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useIsBanned(channel: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${channel}/is_banned`,
		fetcher,
		{
			onError: (e) => {
				console.log("useIsBanned", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `${channel}/is_banned`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		isBanned: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useIsMuted(channel: string) {
	const { data, error, mutate, isLoading } = useSWR(
		`channel/${channel}/is_muted`,
		fetcher,
		{
			onError: (e) => {
				console.log("useIsMuted", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `${channel}/is_muted`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		isMuted: data,
		revalid: mutate,
		isLoading,
		error,
	};
}

export function useAllDM() {
	const { data, error, mutate, isLoading } = useSWR(`dm`, fetcher, {
		onError: (e) => {
			console.log("useAllDM", e);
		},
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			// Never retry on 404.
			if (error?.response?.status === 404) return;

			// Never retry for a specific key.
			if (key === `dm`) return;

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

export function useAllMatchByUserId(userId: number) {
	const { data, error, mutate, isLoading } = useSWR(
		`match/${userId}`,
		fetcher,
		{
			onError: (e) => {
				console.log("useAllMatchByUserId", e);
			},
			onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
				// Never retry on 404.
				if (error?.response?.status === 404) return;

				// Never retry for a specific key.
				if (key === `dm`) return;

				// Only retry up to 10 times.
				if (retryCount >= 10) return;

				// Retry after 5 seconds.
				setTimeout(() => revalidate({ retryCount }), 5000);
			},
		}
	);
	return {
		matches: data,
		revalid: mutate,
		isLoading,
		error,
	};
}
