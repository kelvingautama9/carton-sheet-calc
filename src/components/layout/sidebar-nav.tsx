"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calculator, Table, Package, Weight } from 'lucide-react';

const navItems = [
  { href: '/', label: 'DASHBOARD', icon: Home },
  { href: '/articles', label: 'DATASET', icon: Table },
  { href: '/price-calculator', label: 'PRICE.CALC', icon: Calculator },
  { href: '/moq-calculator', label: 'MOQ.CALC', icon: Package },
  { href: '/tonnage-calculator', label: 'WEIGHT.CALC', icon: Weight },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 relative overflow-hidden',
              isActive 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 transition-transform duration-500",
              isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-primary"
            )} />
            <span className="tracking-[0.1em]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}