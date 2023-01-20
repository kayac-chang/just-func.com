import clsx from "clsx";

const link = clsx("block py-2 text-lg text-xl font-monoton", "hover:underline");

function Header() {
  return (
    <header>
      <div className="container px-4 py-6 lg:p-8 grid gap-4 lg:flex lg:items-end">
        {/* logo */}
        <div data-logo className="py-2">
          ||-Just-Func-||
        </div>

        {/* nav */}
        <nav className="grid sm:flex gap-2 sm:gap-8 lg:ml-auto">
          <a className={link} href="/blogs">
            BLOG
          </a>
          <a className={link} href="/about">
            ABOUT
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
