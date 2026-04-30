import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Calculator, Package, Table, Weight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="relative group overflow-hidden rounded-[2rem] p-1">
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase animate-pulse">
              <Zap className="w-3 h-3" /> System Live
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              VINNS <span className="text-primary">CARTON</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">CALCULATOR</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
              The smartest and fastest BTB carton sheet calculator website. 
              <span className="block mt-2 text-white/60">Accessible anytime, anywhere—fast and easy to use.</span>
            </p>
            <div className="pt-4 flex flex-col items-start">
               <span className="text-sm font-mono tracking-[0.3em] uppercase text-primary/60 mb-1">Terminal Status</span>
               <div className="h-[2px] w-32 bg-primary/30 rounded-full" />
               <p className="mt-2 text-xs font-bold text-muted-foreground uppercase italic tracking-widest">Developed by Vinns</p>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <div className="w-64 h-64 rounded-full bg-primary/20 blur-[100px] absolute -inset-4 animate-pulse" />
            <div className="relative rounded-3xl p-6 w-72 h-72 flex items-center justify-center animate-float">
                <Calculator className="w-32 h-32 text-primary drop-shadow-[0_0_15px_rgba(255,184,0,0.5)]" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ToolCard
          href="/articles"
          icon={Table}
          title="Article Data"
          description="Akses database spesifikasi artikel karton secara lengkap."
          delay="delay-0"
        />
        <ToolCard
          href="/price-calculator"
          icon={Calculator}
          title="Price Calculator"
          description="Estimasi biaya pesanan dengan simulasi tonase otomatis."
          delay="delay-100"
        />
        <ToolCard
          href="/moq-calculator"
          icon={Package}
          title="MOQ Calculator"
          description="Hitung batas minimum order produksi dengan presisi."
          delay="delay-200"
        />
        <ToolCard
          href="/tonnage-calculator"
          icon={Weight}
          title="Tonnage Calculator"
          description="Analisis total berat pesanan untuk kebutuhan logistik."
          delay="delay-300"
        />
      </div>
    </div>
  );
}

function ToolCard({ href, icon: Icon, title, description, delay }: { href: string; icon: React.ElementType; title: string; description: string; delay: string; }) {
  return (
    <Link href={href} className={`group ${delay} animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both`}>
        <Card className="h-full group-hover:bg-white/5 transition-all duration-500 group-hover:-translate-y-2 group-hover:border-primary/40 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-500" />
            <CardHeader>
                <div className="bg-primary/10 text-primary rounded-2xl p-4 w-fit group-hover:bg-primary group-hover:text-primary-foreground group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-primary/20">
                    <Icon className="h-8 w-8" />
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <CardTitle className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors">{description}</CardDescription>
                <div className="flex items-center mt-8 text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:translate-x-2 transition-transform">
                    <span>Execute Module</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}