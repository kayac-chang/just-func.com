import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { assert } from "@sindresorhus/is";

export async function loader(args: LoaderFunctionArgs) {
  assert.string(args.params.slug);

  return null;
}

export default function Route() {
  return (
    <main>
      <article>
        <Outlet />
      </article>
    </main>
  );
}
