import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { parse } from "date-fns";
import { map } from "ramda";
import getBlogList from "~/services/get-blog-list.server";
import parseFrontmatter from "~/services/parse-frontmatter.server";

export const meta: MetaFunction<typeof loader> = () => [
  {
    title: "JUST FUNC",
  },
];

interface Frontmatter {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  published: Date;
}
export function loader() {
  return getBlogList()
    .then(
      map((file) =>
        parseFrontmatter(file.content).then((frontmatter) => {
          const result: Partial<Frontmatter> = {};
          frontmatter.meta.forEach((meta) => {
            if ("title" in meta) {
              result.title = meta.title;
            }
            if ("name" in meta) {
              result[meta.name] = meta.content;
            }
          });
          result.published = parse(
            frontmatter.published,
            "yyyy-MM-dd",
            new Date()
          );
          result.slug = file.pathname
            .replace(/\.mdx$/, "")
            .replace(/^blogs\//, "");
          return result as Frontmatter;
        })
      )
    )
    .then((promises) => Promise.all(promises))
    .then((frontmatters) =>
      frontmatters.sort((a, b) => b.published.getTime() - a.published.getTime())
    )
    .then(json);
}

export default function Component() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="article prose-ul:list-none">
        <ul>
          {data.map((blog) => (
            <li key={blog.slug}>
              <a href={`/blogs/${blog.slug}`}>{blog.title}</a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
