import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

const validChannels = {
	invoke: ["get_env", "auth-callback"],
};

function validate(channelName: string, callType: keyof typeof validChannels) {
	if (!validChannels[callType].includes(channelName)) {
		throw new Error(`Invalid channel name: ${channelName}`);
	}
}

// Custom APIs for renderer
const api = {
	invoke: (channel: string, args: Record<string, unknown>) => {
		return new Promise((resolve, reject) => {
			validate(channel, "invoke");

			ipcRenderer
				.invoke(channel, args)
				.then((response: unknown) => {
					resolve(response);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		});
	},
	fetch: (url: string, options?: RequestInit) => {
		return new Promise((resolve, reject) => {
			ipcRenderer
				.invoke("fetch", { url, options })
				.then((response: unknown) => {
					resolve(response);
				})
				.catch((error: unknown) => {
					reject(error);
				});
		});
	},
	// Authentication event listeners
	onAuthCallback: (callback: (url: string) => void) => {
		ipcRenderer.on("auth-callback", (_event, url) => callback(url));
		return () => ipcRenderer.removeAllListeners("auth-callback");
	},
	onAuthCancelled: (callback: () => void) => {
		ipcRenderer.on("auth-cancelled", callback);
		return () => ipcRenderer.removeAllListeners("auth-cancelled");
	},
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-expect-error (define in dts)
	window.electron = electronAPI;
	// @ts-expect-error (define in dts)
	window.api = api;
}
