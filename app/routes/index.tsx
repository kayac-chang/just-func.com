import { useMemo } from "react";
import { mdx } from "~/utils/mdx.server";
import { getMDXComponent } from "mdx-bundler/client";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { parseISO, format } from "date-fns";
import * as GitHub from "~/utils/github.server";
import { match, P } from "ts-pattern";
import type { MetaFunction } from "@remix-run/node";

function toMDX(source: string) {
  return mdx({ source }).then(json);
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return {
    title: data.frontmatter.title,
  };
};

export async function loader() {
  const res = await GitHub.getFile({
    owner: "kayac-chang",
    repo: "just-func.com",
    path: "contents/blogs/journey.mdx",
  });

  return match(res)
    .with({ status: 200, data: P.select(P.string) }, toMDX)
    .run();
}

function Route() {
  const { code, frontmatter } = useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(code), [code]);

  return (
    <main className="pt-24 px-4 container">
      <article className="prose prose-invert lg:prose-xl mx-auto">
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
