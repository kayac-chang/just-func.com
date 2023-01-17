import { useMemo } from "react";
import { mdx } from "~/utils/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { parseISO, format } from "date-fns";
import * as GitHub from "~/utils/github.server";
import { match, P } from "ts-pattern";

export async function loader() {
  const res = await GitHub.getFile({
    owner: "kayac",
    repo: "just-func.com",
    path: "package.json",
  });

  const data = match(res)
    .with({ status: 200, data: P.select() }, (data) => data)
    .otherwise(() => null);

  const mdxSource = `
---
title: Example Post
published: 2021-02-13
description: This is some description
---

# Wahoo

Here's a **neat** demo:
`.trim();

  return mdx({
    source: mdxSource,
  }).then(json);
}

const layout = "pt-24 px-4";

function Route() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main className={layout}>
      <article className="prose prose-invert">
        <header>
          {/* title */}
          <h1>{frontmatter.title}</h1>

          {/* meta */}
          <div>
            {/* published */}
            <span>
              {format(parseISO(frontmatter.published), "MMMM d, yyyy")}
            </span>
          </div>

          {/* cover */}
          <div className="aspect-video overflow-clip rounded-md">
            <img
              className="w-full h-full object-cover object-center"
              src="https://picsum.photos/seed/picsum/400.webp"
              alt="placeholder"
            />
          </div>
        </header>

        {/* content */}
        <div>
          <Component />
        </div>
      </article>
    </main>
  );
}

export default Route;
