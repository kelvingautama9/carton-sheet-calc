
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculatePrice, calculateMOQ } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  rows: z.array(z.object({
    panjang: z.coerce.number().min(1, "Required"),
    lebar: z.coerce.number().min(1, "Required"),
    substance: z.string().min(3, "Required"),
    flute: z.string().min(1, "Required"),
    diskon: z.coerce.number().min(0).max(100).optional().default(0),
  })),
});

const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const fluteOptions = ["B", "C", "BC"];


export function PriceCalculatorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: [{ panjang: 0, lebar: 0, substance: "K125/M125/K125", flute: "B", diskon: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const watchedRows = form.watch('rows');

  const total = watchedRows?.reduce((acc, row) => {
    const price = calculatePrice({ ...row, diskon: row.diskon ?? 0 });
    if (price === null) {
      acc.hasError = true;
    } else {
      acc.totalPrice += price;
    }
    return acc;
  }, { totalPrice: 0, hasError: false }) ?? { totalPrice: 0, hasError: false };


  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr_2fr_1fr] gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground px-2">
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span>Substance</span>
            <span>F</span>
            <span>Disc%</span>
            <span className="text-right">Price / MOQ</span>
            <span></span>
          </div>
          {fields.map((field, index) => {
            const rowValues = watchedRows?.[index];
            const rowPrice = rowValues ? calculatePrice({ ...rowValues, diskon: rowValues.diskon ?? 0 }) : 0;
            const rowMOQ = rowValues ? calculateMOQ({ ...rowValues }) : 0;
            const isPriceNotFound = rowPrice === null;

            return (
              <div key={field.id} className="grid grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr_2fr_1fr] gap-x-4 items-start bg-accent/20 dark:bg-accent/10 p-2 rounded-lg">
                <FormField control={form.control} name={`rows.${index}.panjang`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="1000" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="500" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.substance`} render={({ field }) => <FormItem><FormControl><Input {...field} placeholder="K125/M125/K125" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.flute`} render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={(value) => {
                        field.onChange(value);
                        const paperWeights = (form.getValues(`rows.${index}.substance`)).split('/').length;
                        if (value === 'BC' && paperWeights < 5) {
                            form.setValue(`rows.${index}.substance`, 'M100/M100/M100/M100/M100');
                        } else if (['B', 'C'].includes(value) && paperWeights > 3) {
                            form.setValue(`rows.${index}.substance`, 'M100/M100/M100');
                        }
                    }} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>{fluteOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name={`rows.${index}.diskon`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="0" /></FormControl><FormMessage/></FormItem>} />
                
                <div className="h-10 flex flex-col items-end justify-center font-mono text-foreground">
                    {isPriceNotFound ? (
                         <span className="text-xs text-destructive text-right">Not Found</span>
                    ) : (
                        <>
                            <span className="text-base">{currencyFormatter.format(rowPrice ?? 0)}</span>
                            <span className="text-xs text-muted-foreground">{isFinite(rowMOQ) ? `${rowMOQ.toLocaleString()} pcs` : 'N/A'}</span>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    {fields.length > 1 && (
                        <Button variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    )}
                </div>
              </div>
            );
          })}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={() => append({ panjang: 0, lebar: 0, substance: "M100/M100/M100", flute: "B", diskon: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Row
        </Button>
        
        <Separator />

        {total.hasError && (
             <Alert variant="destructive">
                <AlertDescription>
                    One or more items were not found in the price list. Please contact admin for assistance. The total shown below may be incorrect.
                </AlertDescription>
            </Alert>
        )}

        <div className="flex justify-end">
            <Card className="w-full max-w-sm bg-background">
                <CardHeader>
                    <CardTitle className="text-lg">Total Estimated Price</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold font-mono text-primary tracking-tight">
                        {currencyFormatter.format(total.totalPrice)}
                    </p>
                </CardContent>
            </Card>
        </div>
      </form>
    </Form>
  );
}
