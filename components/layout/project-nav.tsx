"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  FileText,
  Boxes,
  Database,
  Webhook,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = (projectId: number) => [
  { href: `/projects/${projectId}`, label: "Overview", icon: LayoutDashboard, exact: true },
  { href: `/projects/${projectId}/requirements`, label: "Requirements", icon: ListChecks },
  { href: `/projects/${projectId}/prd`, label: "PRD", icon: FileText },
  { href: `/projects/${projectId}/architecture`, label: "Architecture", icon: Boxes },
  { href: `/projects/${projectId}/database-design`, label: "Database design", icon: Database },
  { href: `/projects/${projectId}/api-design`, label: "API design", icon: Webhook },
  { href: `/projects/${projectId}/roadmap`, label: "Roadmap", icon: Map },
];

export function ProjectNav({ projectId }: { projectId: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {NAV_ITEMS(projectId).map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
