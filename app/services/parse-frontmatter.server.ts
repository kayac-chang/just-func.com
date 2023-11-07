import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkParseFrontmatter from "remark-parse-frontmatter";
import { unified } from "unified";

interface RawFrontmatter {
  meta: (
    | { title: string }
    | {
        name: "description";
        content: string;
      }
    | {
        name: "keywords";
        content: string;
      }
  )[];
  published: string;
}

export const parseFrontmatter = (content: string) =>
  unified()
    .use(remarkParse)
    .use(remarkStringify)
    .use(remarkFrontmatter)
    .use(remarkParseFrontmatter)
    .process(content)
    .then((file) => file.data.frontmatter as RawFrontmatter);
export default parseFrontmatter;
