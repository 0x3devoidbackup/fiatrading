"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbarRoutes = ["/", "/signin", "/signup"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <main className="container mx-auto">
        {children}
      </main>
    </>
  );
}
