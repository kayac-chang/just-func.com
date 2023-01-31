/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  cacheDirectory: "./node_modules/.cache/remix",
  serverDependenciesToBundle: [/mdx-bundler/, /@sindresorhus/],
};
