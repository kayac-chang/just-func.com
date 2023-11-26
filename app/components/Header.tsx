import { Link } from "@remix-run/react";

function Header() {
  return (
    <header>
      <div className="container px-4 py-6 md:p-8 grid gap-4 md:flex md:items-end">
        {/* logo */}
        <Link to="/">
          <div data-logo className="py-2">
            ||-Just-Func-||
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
