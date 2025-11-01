import { MoqCalculatorForm } from "@/components/calculators/moq-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function MoqCalculatorPage() {
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/20 text-primary rounded-lg p-3 w-fit">
                        <Package className="h-8 w-8" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">MOQ Calculator</CardTitle>
                        <CardDescription>Determine the Minimum Order Quantity (MOQ) in sheets based on a minimum tonnage.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <MoqCalculatorForm />
                </CardContent>
            </Card>
        </div>
    );
}
