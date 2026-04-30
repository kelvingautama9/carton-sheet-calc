
import { PriceCalculatorForm } from "@/components/calculators/price-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";

export default function PriceCalculatorPage() {
    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <Card className="bg-card/50">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/20 text-primary rounded-lg p-3 w-fit">
                        <Calculator className="h-8 w-8" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Price Calculator</CardTitle>
                        <CardDescription>Estimate the price per sheet and see the MOQ based on your specifications.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <PriceCalculatorForm />
                </CardContent>
            </Card>
        </div>
    );
}

    