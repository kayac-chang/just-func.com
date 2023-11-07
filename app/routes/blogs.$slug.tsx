import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import parseBlogServer from "~/services/parse-blog.server";
import getBlogBySlugServer from "~/services/get-blog-by-slug.server";

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);
  return getBlogBySlugServer(args.params.slug).then(parseBlogServer);
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <article dangerouslySetInnerHTML={{ __html: data }}></article>
    </main>
  );
}
