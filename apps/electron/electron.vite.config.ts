import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "electron-vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const require = createRequire(import.meta.url);
const uiRoot = dirname(require.resolve("@melos/ui/package.json"));
const outDir = resolve(__dirname, "out/renderer");

export default defineConfig({
	main: {
		plugins: [viteTsConfigPaths()],
	},
	preload: {
		plugins: [viteTsConfigPaths()],
	},
	renderer: {
		root: uiRoot,
		build: {
			outDir,
			emptyOutDir: true,
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
			devtools(),
			viteTsConfigPaths({
				projects: [resolve(uiRoot, "tsconfig.json")],
			}),
			tailwindcss(),
			tanstackRouter({
				routesDirectory: resolve(uiRoot, "src/routes"),
				generatedRouteTree: resolve(uiRoot, "src/routeTree.gen.ts"),
			}),
			viteReact(),
		],
	},
});
