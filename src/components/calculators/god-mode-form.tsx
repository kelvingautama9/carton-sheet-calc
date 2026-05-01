import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fluteOptions } from '@/data/select-options';
import { calculatePrice, calculateMOQ, calculateTonnage, calculateGrammage } from "@/lib/calculations";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
    panjang: z.number().min(1, "Panjang harus lebih dari 0"),
    lebar: z.number().min(1, "Lebar harus lebih dari 0"),
    substance: z.string().min(1, "Substance is required"),
    flute: z.string(),
    diskon: z.number().optional(),
    quantity: z.number().min(1, "Quantity harus lebih dari 0"),
});

export function GodModeForm() {
    const [results, setResults] = useState({ price: 0, moq: 0, tonnage: 0, weightPerPcs: 0 });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            panjang: 0,
            lebar: 0,
            substance: "K125/M125/K125",
            flute: "B",
            diskon: 0,
            quantity: 0,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const price = calculatePrice({ ...values, diskon: values.diskon ?? 0 }) ?? 0;
        const moq = calculateMOQ(values) ?? 0;
        const tonnage = calculateTonnage({ ...values, quantity: values.quantity || 0 }) ?? 0;
        
        const grammage = calculateGrammage(values.substance, values.flute);
        const areaInM2 = (values.panjang / 1000) * (values.lebar / 1000);
        const weightPerPcs = grammage * areaInM2;

        setResults({ price, moq, tonnage, weightPerPcs });
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="panjang" render={({ field }) => (<FormItem><FormLabel>Panjang (mm)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} className="bloomberg-input" onFocus={e => e.target.select()} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lebar" render={({ field }) => (<FormItem><FormLabel>Lebar (mm)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} className="bloomberg-input" onFocus={e => e.target.select()} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="substance" render={({ field }) => (<FormItem><FormLabel>Substance</FormLabel><FormControl><Input {...field} className="bloomberg-input" placeholder="e.g., K125/M125/K125" /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="flute" render={({ field }) => (<FormItem><FormLabel>Flute</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bloomberg-input"><SelectValue placeholder="Select a flute" /></SelectTrigger></FormControl><SelectContent>{fluteOptions.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="diskon" render={({ field }) => (<FormItem><FormLabel>Diskon (%)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} className="bloomberg-input" onFocus={e => e.target.select()} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="quantity" render={({ field }) => (<FormItem><FormLabel>Quantity</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ''} className="bloomberg-input" onFocus={e => e.target.select()} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <Button type="submit" className="w-full">Calculate</Button>
                </form>
            </Form>

            <Card className="bg-black/20 border-border/30">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Price</span>
                            <span className="text-2xl font-bold">Rp {results.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">MOQ</span>
                            <span className="text-2xl font-bold">{results.moq.toLocaleString()} pcs</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Weight</span>
                            <span className="text-2xl font-bold">{results.tonnage.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })} tons</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Weight/pcs</span>
                            <span className="text-2xl font-bold">{results.weightPerPcs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} g</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
