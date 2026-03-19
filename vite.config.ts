import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, type ConfigEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  const isLibMode = mode === "lib";
  return {
    css: {
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCase",
        generateScopedName: "[name]__[local]___[hash:base64:5]"
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      lib: isLibMode
        ? {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "rc-scanner-react",
            fileName: (format) => `index.${format}.js`,
          }
        : undefined,
      rollupOptions: {
        external: isLibMode ? ["react", "react-dom"] : undefined,
        output: isLibMode
          ? {
              globals: {
                react: "React",
                "react-dom": "ReactDOM",
              },
            }
          : undefined,
      },
    },
    root: isLibMode ? undefined : "demo",
  };
});
