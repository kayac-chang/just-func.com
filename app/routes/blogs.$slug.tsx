import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import parseBlogServer from "~/services/parse-blog.server";
import getBlogBySlugServer from "~/services/get-blog-by-slug.server";
import parseFrontmatter from "~/services/parse-frontmatter.server";
import Giscus from "@giscus/react";

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

      <div className="max-w-screen-lg mx-auto px-16 mt-32">
        <Giscus
          id="comments"
          repo="kayac-chang/just-func.com"
          repoId="R_kgDOIrjzQQ"
          category="Announcements"
          categoryId="DIC_kwDOIrjzQc4CbRJZ"
          strict="0"
          mapping="title"
          reactionsEnabled="0"
          emitMetadata="0"
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-TW"
          loading="lazy"
        />
      </div>
    </main>
  );
}
