import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  const url = new URL("/", `http://${host}`);

  return fetch(url.toString(), { method: "HEAD" })
    .then((r) => {
      if (!r.ok) return Promise.reject(r);
      return new Response("OK");
    })
    .catch((error: unknown) => {
      console.log("healthcheck ❌", { error });
      return new Response("ERROR", { status: 500 });
    });
}
