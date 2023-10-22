import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { assert } from "@sindresorhus/is";
import { match, P } from "ts-pattern";
import * as Github from "~/lib/github.server";
import { compile, runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);

  return (
    Github.getFile({
      owner: "kayac-chang",
      repo: "just-func.com",
      path: `/blogs/${args.params.slug}.mdx`,
    })
      //
      .then((res) =>
        match(res)
          .with({ status: 404 }, () =>
            Promise.reject(new Response(null, { status: 404 }))
          )
          .with({ status: 200, data: P.select(P.string) }, (source) =>
            compile(source).then(String)
          )
          .otherwise(() => Promise.reject(new Response(null, { status: 500 })))
      )
  );
}

export default function Route() {
  const data = useLoaderData<typeof loader>();
  // const Component = useMemo(() => getMDXComponent(data.code), [data.code]);
  console.log(runSync(data, runtime));

  return (
    <main>
      <article>
        <Outlet />
      </article>
    </main>
  );
}
