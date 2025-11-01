"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calculator, Table, Package, Weight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/articles', label: 'Articles', icon: Table },
  { href: '/price-calculator', label: 'Price Calculator', icon: Calculator },
  { href: '/moq-calculator', label: 'MOQ Calculator', icon: Package },
  { href: '/tonnage-calculator', label: 'Tonnage Calculator', icon: Weight },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href && 'bg-accent/50 text-primary'
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
