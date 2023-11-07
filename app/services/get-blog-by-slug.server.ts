import { match, P } from "ts-pattern";
import path from "path";
import { readFileUtf8 } from "~/lib/fs.server";
import githubGetContent from "~/services/github-get-contnet.server";
import { assert } from "@sindresorhus/is";

const getBlogBySlugGithub = (slug: string) =>
  githubGetContent(`/blogs/${slug}.mdx`).then((res) => {
    assert.string(res);
    return res;
  });

const getBlogBySlugLocal = (slug: string) =>
  readFileUtf8(path.resolve(process.cwd(), `./blogs/${slug}.mdx`));

const getBlogBySlug = (slug: string) =>
  match(process.env.NODE_ENV)
    .with(P.union("development", "test"), () => getBlogBySlugLocal(slug))
    .with("production", () => getBlogBySlugGithub(slug))
    .exhaustive();

export default getBlogBySlug;
