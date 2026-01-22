import type { ElectronAPI } from "@electron-toolkit/preload";

/**
 * Response type for fetch calls through the Electron bridge
 */
interface FetchResponse {
	ok: boolean;
	status: number;
	statusText: string;
	headers: Record<string, string>;
	body: string;
	json?: unknown;
}

/**
 * Response type for API invoke calls
 */
type InvokeResponse =
	| string
	| number
	| boolean
	| Record<string, unknown>
	| unknown[];

declare global {
	interface Window {
		electron: ElectronAPI;
		api: {
			invoke: (
				channel: string,
				args: Record<string, unknown>
			) => Promise<InvokeResponse>;
			fetch: (url: string, options?: RequestInit) => Promise<FetchResponse>;
			geniusApi: (
				path: string
			) => Promise<{ success: boolean; data?: string; error?: string }>;
			onAuthCallback: (callback: (url: string) => void) => () => void;
			onAuthCancelled: (callback: () => void) => () => void;
		};
	}
}
