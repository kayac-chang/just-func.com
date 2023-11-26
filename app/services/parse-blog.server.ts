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
import { P, match } from "ts-pattern";
import { identity } from "ramda";

const LINK_ICON =
  '<svg class="inline-block w-6 aspect-square" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill="currentColor" d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg>';

const parseBlog = (source: string) =>
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
      content: fromHtmlIsomorphic(LINK_ICON, { fragment: true })
        .children as Array<ElementContent>,
    })
    // @ts-ignore
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(source)
    .then((res) =>
      match(res.value)
        .with(P.string, identity)
        .with(P.instanceOf(Uint8Array), (v) => new TextDecoder().decode(v))
        .exhaustive()
    );

export default parseBlog;
