"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculateTonnage } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  rows: z.array(z.object({
    panjang: z.coerce.number().min(1, "Required"),
    lebar: z.coerce.number().min(1, "Required"),
    substance: z.string().min(3, "Required"),
    flute: z.string().min(1, "Required"),
    quantity: z.coerce.number().min(1, "Required"),
  })),
});

const fluteOptions = ["B", "C", "BC"];

export function TonnageCalculatorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: [{ panjang: 0, lebar: 0, substance: "", flute: "B", quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const watchedRows = useWatch({
    control: form.control,
    name: "rows",
  });

  const totalTonnage = watchedRows.reduce((acc, row) => {
    const tonnage = calculateTonnage({ ...row });
    return acc + (isNaN(tonnage) ? 0 : tonnage);
  }, 0);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-4">
          {/* Header desktop */}
          <div className="hidden md:grid grid-cols-[1fr_1fr_2fr_0.8fr_1fr_1.5fr_40px] gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground px-2">
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span>Substance</span>
            <span>F</span>
            <span>Quantity</span>
            <span className="text-right">Weight (tonnes)</span>
            <span></span>
          </div>

          <div className="space-y-4 md:space-y-2">
            {fields.map((field, index) => {
              const rowValues = watchedRows[index];
              const rowTonnage = calculateTonnage({ ...rowValues });

              return (
                <div key={field.id} className="relative grid grid-cols-2 md:grid-cols-[1fr_1fr_2fr_0.8fr_1fr_1.5fr_40px] gap-x-3 gap-y-3 md:gap-y-0 md:gap-x-4 items-start bg-accent/20 dark:bg-accent/10 p-4 md:p-2 rounded-lg border md:border-none border-border/50">
                  
                  {/* Delete button mobile */}
                  <div className="absolute top-2 right-2 md:static md:flex md:items-center md:justify-end">
                    {fields.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField control={form.control} name={`rows.${index}.panjang`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Length (mm)</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Length" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Width (mm)</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Width" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.substance`} render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1 space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Substance</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. K125/M125/K125" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.flute`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Flute</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          const currentSubstance = form.getValues(`rows.${index}.substance`);
                          const paperWeights = currentSubstance ? currentSubstance.split('/').length : 0;
                          
                          if (value === 'BC' && paperWeights !== 5) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100/M100/M100');
                          } else if (['B', 'C'].includes(value) && paperWeights !== 3) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100');
                          }
                      }} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{fluteOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.quantity`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Quantity</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Quantity" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  
                  <div className="col-span-2 md:col-span-1 h-auto md:h-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono text-foreground bg-primary/5 md:bg-transparent p-2 md:p-0 rounded md:rounded-none">
                    <span className="md:hidden text-xs text-muted-foreground font-sans">Row Weight:</span>
                    <span className="font-bold text-primary md:text-foreground">
                      {isNaN(rowTonnage) ? '0.000' : rowTonnage.toFixed(3)}
                      <span className="md:hidden ml-1 text-[10px] font-sans font-medium text-muted-foreground">tonnes</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full md:w-auto" size="sm" onClick={() => append({ panjang: 0, lebar: 0, substance: "125/110/125", flute: "B", quantity: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
        
        <Separator />

        <div className="flex justify-end">
            <Card className="w-full max-w-sm bg-background/50 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base text-muted-foreground uppercase tracking-wider font-semibold">Total Tonnage</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl md:text-4xl font-bold font-mono text-primary tracking-tight">
                        {totalTonnage.toFixed(4)}
                        <span className="text-lg ml-2 font-sans font-medium text-muted-foreground">tonnes</span>
                    </p>
                </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
