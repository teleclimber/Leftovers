export enum LoadState {
	NotLoaded = 0,
	Loading = 1,
	Loaded = 2
}

export interface User {
	proxy_id: string,
	display_name: string,
	avatar: string
}