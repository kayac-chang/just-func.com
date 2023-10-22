import path from "path";
import { bundleMDX } from "mdx-bundler";
import remarkToc from "remark-toc";
import remarkReadingTime from "remark-reading-time";
// import remarkReadingTimeMdx from "remark-reading-time/mdx";
import rehypeHighlight from "rehype-highlight";

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

type Props = {
  source: string;
};
export function mdx(props: Props) {
  return bundleMDX({
    ...props,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkToc,
        remarkReadingTime,
        // remarkReadingTimeMdx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeHighlight(),
      ];
      return options;
    },
  });
}
