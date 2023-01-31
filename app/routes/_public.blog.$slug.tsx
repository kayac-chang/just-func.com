import { useMemo } from "react";
import { mdx } from "~/utils/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { useCatch, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { parseISO, format } from "date-fns";
import * as GitHub from "~/utils/github.server";
import { match, P } from "ts-pattern";
import readingTime from "reading-time";
import { assert } from "@sindresorhus/is";
import { notFound } from "remix-utils";
import type { MetaFunction, LoaderArgs } from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  assert.string(params.slug);
  if (!data) {
    return {
      title: "Missing Blog",
      description: `There is no blog with the slug of ${params.slug}. 😢`,
    };
  }
  return {
    title: `${data.title} | JUST FUNC`,
    description: data.description,
  };
};

interface Meta {
  title: string;
  published: string;
  description: string;
  cover: {
    src: string;
    alt: string;
  };
}

export async function loader({ params }: LoaderArgs) {
  assert.string(params.slug);

  return (
    GitHub.getFile({
      owner: "kayac-chang",
      repo: "just-func.com",
      path: `contents/blogs/${params.slug}.mdx`,
    })
      //
      .then((res) =>
        match(res)
          .with({ status: 404 }, () => Promise.reject(notFound(null)))
          .with({ status: 200, data: P.select(P.string) }, (source) =>
            mdx<Meta>({ source })
              .then(({ code, frontmatter }) => ({
                title: frontmatter.title,
                published: frontmatter.published,
                description: frontmatter.description,
                code,
                readingTime: readingTime(source).minutes,
              }))
              .then(json)
          )
          .run()
      )
  );
}

export default function Route() {
  const { code, title, published, readingTime } =
    useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main>
      <article>
        <header>
          {/* title */}
          <h1>{title}</h1>

          {/* meta */}
          <div>
            {/* published */}
            <span>{format(parseISO(published), "MMMM d, yyyy")}</span>
            <span> — </span>
            {/* reading time */}
            <span>{Math.round(readingTime)} mins read</span>
          </div>

          {/* cover */}
          <div className="aspect-[3/4] md:aspect-[3/2]">
            <img
              className="h-full object-cover object-center rounded-md"
              src="https://picsum.photos/seed/picsum/1200/630.webp"
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

export function CatchBoundary() {
  return match(useCatch())
    .with({ status: 404 }, () => (
      <main>
        <h1 className="lg:text-5xl font-bold">Missing Blog</h1>
      </main>
    ))
    .run();
}
