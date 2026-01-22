import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const uiRoot = resolve(__dirname, "../../packages/ui");

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
	},
	renderer: {
		root: uiRoot,
		build: {
			rollupOptions: {
				input: resolve(uiRoot, "index.html"),
			},
		},
		resolve: {
			alias: {
				"@": resolve(uiRoot, "src"),
			},
		},
		plugins: [
			TanStackRouterVite({
				routesDirectory: resolve(uiRoot, "src/routes"),
				generatedRouteTree: resolve(uiRoot, "src/routeTree.gen.ts"),
			}),
			viteTsConfigPaths({
				projects: [resolve(uiRoot, "tsconfig.json")],
			}),
			tailwindcss(),
			viteReact(),
		],
	},
});
