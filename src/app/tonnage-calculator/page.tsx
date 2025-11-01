import { TonnageCalculatorForm } from "@/components/calculators/tonnage-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Weight } from "lucide-react";

export default function TonnageCalculatorPage() {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
            <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/20 text-primary rounded-lg p-3 w-fit">
                        <Weight className="h-8 w-8" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Tonnage Calculator</CardTitle>
                        <CardDescription>Calculate the total weight of single or double wall sheets in tonnes.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <TonnageCalculatorForm />
                </CardContent>
            </Card>
        </div>
    );
}
