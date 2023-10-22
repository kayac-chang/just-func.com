/** @type {import('@remix-run/dev').AppConfig} */
export default {
  tailwind: true,
  postcss: true,
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: ["mdx-bundler"],
  browserNodeBuiltinsPolyfill: {
    modules: { stream: true, util: true },
  },

  // async mdx() {
  //   const [rehypeHighlight, remarkToc, readingTime] = await Promise.all([
  //     import("rehype-highlight").then((mod) => mod.default),
  //     import("remark-toc").then((mod) => mod.default),
  //     import("remark-reading-time").then((mod) => mod.default),
  //   ]);
  //
  //   return {
  //     remarkPlugins: [remarkToc, readingTime, readingTimeMdx],
  //     rehypePlugins: [rehypeHighlight],
  //   };
  // },
};
