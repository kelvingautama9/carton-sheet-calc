import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, Package, Table, Weight } from 'lucide-react';

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-factory");

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="relative w-full h-72 md:h-80 rounded-xl overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground">Welcome to Carton Sheet Calc</h1>
            <p className="mt-2 text-md md:text-lg text-muted-foreground max-w-2xl">
                Your all-in-one toolkit for carton sheet calculations. Streamline your workflow with our precise and easy-to-use calculators.
            </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ToolCard
          href="/articles"
          icon={Table}
          title="Article Data"
          description="View, search, and sort article specifications."
        />
        <ToolCard
          href="/price-calculator"
          icon={Calculator}
          title="Price Calculator"
          description="Estimate the cost of your carton sheet orders."
        />
        <ToolCard
          href="/moq-calculator"
          icon={Package}
          title="MOQ Calculator"
          description="Determine the minimum order quantity needed."
        />
        <ToolCard
          href="/tonnage-calculator"
          icon={Weight}
          title="Tonnage Calculator"
          description="Calculate the total weight of your sheets."
        />
      </div>
    </div>
  );
}

function ToolCard({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string; }) {
  return (
    <Link href={href} className="group">
        <Card className="h-full bg-card/50 backdrop-blur-sm hover:border-primary transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            <CardHeader>
                <div className="bg-primary/20 text-primary rounded-lg p-3 w-fit">
                    <Icon className="h-8 w-8" />
                </div>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-xl font-semibold mb-2 text-foreground">{title}</CardTitle>
                <CardDescription className="text-muted-foreground">{description}</CardDescription>
                <div className="flex items-center mt-4 text-sm font-medium text-primary group-hover:translate-x-1 transition-transform">
                    <span>Get started</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}
