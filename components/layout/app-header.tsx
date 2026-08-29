import Link from "next/link";
import { Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="border-b border-border">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Blocks className="size-5 text-primary" />
          <span>AI Architect</span>
        </Link>
        <Button asChild size="sm">
          <Link href="/projects/new">New project</Link>
        </Button>
      </div>
    </header>
  );
}
