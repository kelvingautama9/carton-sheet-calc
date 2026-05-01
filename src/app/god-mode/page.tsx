"use client";

import { GodModeForm } from "@/components/calculators/god-mode-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export default function GodModePage() {
    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <Card className="bg-black/20 border-border/30">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/20 text-primary rounded-lg p-3 w-fit">
                        <Terminal className="h-8 w-8" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">God Mode</CardTitle>
                        <CardDescription>All-in-one calculator for Price, MOQ, and Tonnage.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <GodModeForm />
                </CardContent>
            </Card>
        </div>
    );
}
