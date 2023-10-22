import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import { match, P } from "ts-pattern";
import * as Github from "~/lib/github.server";

import fs from "fs/promises";
import path from "path";

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import remarkReadingTime from "remark-reading-time";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);

  return match(process.env.NODE_ENV)
    .with(P.union("development", "test"), () =>
      fs.readFile(
        path.resolve(process.cwd(), `./blogs/${args.params.slug}.mdx`),
        "utf-8"
      )
    )
    .with("production", () =>
      Github.getFile({
        owner: "kayac-chang",
        repo: "just-func.com",
        path: `/blogs/${args.params.slug}.mdx`,
      }).then((res) =>
        match(res)
          .with({ status: 404 }, () =>
            Promise.reject(new Response(null, { status: 404 }))
          )
          .with({ status: 200, data: P.select(P.string) }, String)
          .otherwise(() => Promise.reject(new Response(null, { status: 500 })))
      )
    )
    .exhaustive()
    .then((source) =>
      unified()
        .use(remarkParse)
        .use(remarkFrontmatter)
        .use(remarkReadingTime, {})
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypePrettyCode)
        .use(rehypeStringify)
        .process(source)
        .then((res) => res.value)
    );
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <article dangerouslySetInnerHTML={{ __html: data }}></article>
    </main>
  );
}
