import { Outlet } from "@remix-run/react";

export default function Route() {
  return (
    <main>
      <article>
        <Outlet />
      </article>
    </main>
  );
}
