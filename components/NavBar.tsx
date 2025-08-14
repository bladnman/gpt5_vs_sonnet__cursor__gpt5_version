"use client";
import SearchBox from "@/app/search/features/search_box/SearchBox";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Suspense} from "react";

type NavItem = {href: string; label: string; exact?: boolean};

const items: NavItem[] = [
  {href: "/", label: "Home", exact: true},
  {href: "/search", label: "Search"},
  {href: "/watchlist", label: "Watchlist"},
  {href: "/history", label: "History"},
  {href: "/ratings", label: "Ratings"},
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-[--background]/75 border-b border-[--color-border]">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          The Shows
        </Link>

        <div className="hidden md:block flex-1 max-w-xl mx-4">
          <Suspense>
            <SearchBox />
          </Suspense>
        </div>

        <nav className="flex items-center gap-1">
          {items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive
                    ? "bg-[--color-muted] ring-1 ring-inset ring-[--color-border]"
                    : "opacity-80 hover:opacity-100",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <div
            className="ml-2 w-8 h-8 rounded-full bg-[--color-muted] ring-1 ring-[--color-border]"
            aria-label="Account"
          />
        </nav>
      </div>
    </header>
  );
}
