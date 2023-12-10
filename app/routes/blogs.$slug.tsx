import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import parseBlogServer from "~/services/parse-blog.server";
import getBlogBySlugServer from "~/services/get-blog-by-slug.server";
import Giscus from "@giscus/react";
import { getMDXComponent } from "mdx-bundler/client/index.js";
import { useMemo } from "react";
import Exam from "~/components/Exam";

export const meta: MetaFunction<typeof loader> = (args) =>
  args.data?.frontmatter.meta ?? [];

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);
  return getBlogBySlugServer(args.params.slug).then((content) =>
    parseBlogServer(content)
  );
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  const Component = useMemo(() => getMDXComponent(data.code), [data.code]);
  return (
    <main>
      <article>
        <Component
          components={{
            Exam,
          }}
        />
      </article>

      <div className="max-w-screen-lg mx-auto md:px-16 mt-16 md:mt-32">
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
