import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import { match, P } from "ts-pattern";
import * as Github from "~/lib/github.server";

import fs from "fs/promises";
import path from "path";

import type { ElementContent } from "hast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
// @ts-ignore
import remarkHeadingId from "remark-heading-id";
import remarkRehype from "remark-rehype";
import remarkReadingTime from "remark-reading-time";
import remarkFrontmatter from "remark-frontmatter";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic";

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
        .use(remarkHeadingId)
        .use(remarkReadingTime, {})
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
          behavior: "append",
          content: fromHtmlIsomorphic(
            '<svg class="inline-block w-6 aspect-square" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>',
            { fragment: true }
          ).children as Array<ElementContent>,
        })
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
