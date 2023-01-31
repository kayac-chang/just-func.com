import path from "path";

if (process.platform === "win32") {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "esbuild.exe"
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    "node_modules",
    "esbuild",
    "bin",
    "esbuild"
  );
}

export { bundleMDX as mdx } from "mdx-bundler";
