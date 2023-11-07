import { identity } from "ramda";
import { match, P } from "ts-pattern";
import * as Github from "~/lib/github.server";

const githubGetContent = (path: string) =>
  Github.getContent({
    owner: "kayac-chang",
    repo: "just-func.com",
    path,
  }).then((res) =>
    match(res)
      .with({ status: 404 }, () =>
        Promise.reject(new Response(null, { status: 404 }))
      )
      .with(
        {
          status: 200,
          data: P.select(
            P.array({
              name: P.string,
              path: P.string,
            })
          ),
        },
        identity
      )
      .with({ status: 200, data: P.select(P.string) }, String)
      .otherwise(() => Promise.reject(new Response(null, { status: 500 })))
  );
export default githubGetContent;
