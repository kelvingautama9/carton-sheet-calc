"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Package2 } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-lg px-4 sm:px-6 md:hidden">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">CartonCalc</span>
        </Link>
    </header>
  );
}
