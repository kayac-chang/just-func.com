/** @type {import('@remix-run/dev').AppConfig} */
export default {
  tailwind: true,
  postcss: true,
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  browserNodeBuiltinsPolyfill: {
    modules: { stream: true, util: true, process: true, path: true, url: true },
  },
};
