import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Package2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Carton Sheet Calc',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <SidebarProvider>
            <Sidebar className="border-r border-border/50 bg-card/30 backdrop-blur-lg">
                <SidebarContent>
                    <SidebarHeader className="border-b border-border/50 p-2">
                        <Link href="/" className="flex items-center gap-2">
                            <Package2 className="h-8 w-8 text-primary" />
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">
                                CartonCalc
                            </h2>
                        </Link>
                    </SidebarHeader>
                    <div className="p-2">
                        <SidebarNav />
                    </div>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-col flex-1 h-screen">
                    <Header />
                    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                        {children}
                    </main>
                </div>
            </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
