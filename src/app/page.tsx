import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Calculator, Package, Table, Weight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50 bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32" />
        
        <div className="relative z-10 p-8 md:p-12 w-full">
            <div className="max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground drop-shadow-xl mb-4">
                    Vinns <span className="text-primary italic">Carton Sheet</span> <br/>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Calculator</span>
                </h1>
                <p className="text-md md:text-xl text-foreground font-semibold leading-relaxed mb-2">
                    The smartest and fastest BTB carton sheet calculator website
                </p>
                <p className="text-sm text-muted-foreground font-medium italic">
                    Developed by Vinns
                </p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        <ToolCard
          href="/articles"
          icon={Table}
          title="Article Data"
          description="Akses database spesifikasi artikel karton secara lengkap."
        />
        <ToolCard
          href="/price-calculator"
          icon={Calculator}
          title="Price Calculator"
          description="Estimasi biaya pesanan dengan simulasi tonase otomatis."
        />
        <ToolCard
          href="/moq-calculator"
          icon={Package}
          title="MOQ Calculator"
          description="Hitung batas minimum order produksi dengan presisi."
        />
        <ToolCard
          href="/tonnage-calculator"
          icon={Weight}
          title="Tonnage Calculator"
          description="Analisis total berat pesanan untuk kebutuhan logistik."
        />
      </div>
    </div>
  );
}

function ToolCard({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string; }) {
  return (
    <Link href={href} className="group">
        <Card className="h-full bg-card/40 backdrop-blur-md border-border/50 hover:border-primary/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(var(--primary),0.1)]">
            <CardHeader>
                <div className="bg-primary/10 text-primary rounded-xl p-4 w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                    <Icon className="h-8 w-8" />
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">{description}</CardDescription>
                <div className="flex items-center mt-6 text-sm font-bold text-primary group-hover:translate-x-2 transition-transform">
                    <span>Mulai Hitung</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}
