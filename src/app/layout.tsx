import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Package2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Vinns Carton Sheet Calculator',
  description: 'Calculators for the carton sheet industry',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen">
        <SidebarProvider>
            <Sidebar className="border-r border-white/5 bg-black/40 backdrop-blur-2xl">
                <SidebarContent>
                    <SidebarHeader className="border-b border-white/5 p-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 animate-float">
                                <Package2 className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tighter text-foreground leading-none">
                                    VINNS<span className="text-primary italic">CALC</span>
                                </h2>
                                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Terminal v2.0</span>
                            </div>
                        </Link>
                    </SidebarHeader>
                    <div className="p-4">
                        <SidebarNav />
                    </div>
                </SidebarContent>
            </Sidebar>
            <SidebarInset className="bg-transparent">
                <div className="flex flex-col flex-1 h-screen relative">
                    <Header />
                    <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-auto scrollbar-hide">
                       <div className="animate-slide-in-from-bottom">
                          {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}