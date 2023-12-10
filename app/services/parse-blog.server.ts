import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { bundleMDX } from "mdx-bundler";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const parseBlog = async (source: string) =>
  bundleMDX({
    source,
    // files: {
    //   "./app/components/ui/collapsible.tsx": collapsible,
    //   "./app/components/Exam.tsx": exam,
    // },
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        remarkMath,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypePrettyCode,
        rehypeKatex,
      ];
      return options;
    },
  });

export default parseBlog;
