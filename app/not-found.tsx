import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center">
      <p className="font-heading text-6xl font-bold text-muted-foreground/40">404</p>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          This page or poll does not exist. Check the link you were given — it may
          have been mistyped or the poll was deleted by its owner.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Create your own poll</Link>
      </Button>
    </div>
  );
}
