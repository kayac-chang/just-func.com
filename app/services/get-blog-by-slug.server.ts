import { match, P } from "ts-pattern";
import * as Github from "~/lib/github.server";
import path from "path";
import { readFileUtf8 } from "./fs.server";

export default (slug: string) =>
  match(process.env.NODE_ENV)
    .with(P.union("development", "test"), () =>
      readFileUtf8(path.resolve(process.cwd(), `./blogs/${slug}.mdx`))
    )
    .with("production", () =>
      Github.getFile({
        owner: "kayac-chang",
        repo: "just-func.com",
        path: `/blogs/${slug}.mdx`,
      })
        //
        .then((res) =>
          match(res)
            .with({ status: 404 }, () =>
              Promise.reject(new Response(null, { status: 404 }))
            )
            .with({ status: 200, data: P.select(P.string) }, String)
            .otherwise(() =>
              Promise.reject(new Response(null, { status: 500 }))
            )
        )
    )
    .exhaustive();
