import { Outlet } from "@remix-run/react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

function Layout() {
  return (
    <>
      <Header />
      <hr className="w-6 my-8 mx-auto" />
      <Outlet />
      <hr className="w-6 my-8 mx-auto" />
      <Footer />
    </>
  );
}

export default Layout;
