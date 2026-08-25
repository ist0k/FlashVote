"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/components/i18n-provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { dict } = useI18n();
  const pathname = usePathname();

  const links = [
    // Hidden on phones: the logo already links home, and RU labels are long.
    { href: "/", label: dict.nav.create, className: "hidden sm:block" },
    { href: "/polls", label: dict.nav.myPolls, className: "" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-1 px-3 sm:gap-2 sm:px-4">
        <Link
          href="/"
          aria-label={dict.brand}
          className="shrink-0 rounded-md font-heading text-base font-semibold tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-lg"
        >
          Flash<span className="text-primary">Vote</span>
        </Link>
        <nav
          aria-label="Main"
          className="flex min-w-0 items-center gap-0.5 text-sm sm:gap-1"
        >
          {links.map(({ href, label, className }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-2 py-2 font-medium whitespace-nowrap transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3",
                  active ? "text-foreground" : "text-muted-foreground",
                  className,
                )}
              >
                {label}
              </Link>
            );
          })}
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
