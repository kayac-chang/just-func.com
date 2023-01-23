import { Link } from "@remix-run/react";
import clsx from "clsx";

const link = clsx("py-2 text-lg text-xl font-monoton", "hover:underline");

function Header() {
  return (
    <header>
      <div className="container px-4 py-6 lg:p-8 grid gap-4 lg:flex lg:items-end">
        {/* logo */}
        <Link to="/">
          <div data-logo className="py-2">
            ||-Just-Func-||
          </div>
        </Link>

        {/* nav */}
        <nav className="grid sm:flex gap-2 sm:gap-8 lg:ml-auto">
          <Link to="/blogs">
            <div className={link}>BLOG</div>
          </Link>
          <Link to="/about">
            <div className={link}>ABOUT</div>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
