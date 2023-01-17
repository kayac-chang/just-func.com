import { bundleMDX } from "mdx-bundler";

export function mdx(...props: Parameters<typeof bundleMDX>) {
  return bundleMDX(...props);
}
