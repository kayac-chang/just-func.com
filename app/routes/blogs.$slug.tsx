import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import parseBlogServer from "~/services/parse-blog.server";
import getBlogBySlugServer from "~/services/get-blog-by-slug.server";
import parseFrontmatter from "~/services/parse-frontmatter.server";

export const meta: MetaFunction<typeof loader> = (args) =>
  args.data?.frontmatter.meta ?? [];

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);
  return getBlogBySlugServer(args.params.slug).then((content) =>
    Promise.all([parseFrontmatter(content), parseBlogServer(content)]).then(
      ([frontmatter, body]) => ({
        frontmatter,
        body,
      })
    )
  );
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <article dangerouslySetInnerHTML={{ __html: data.body }}></article>
    </main>
  );
}
