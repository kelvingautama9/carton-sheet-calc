"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Calculator, Weight } from "lucide-react";
import { calculatePrice, calculateMOQ, calculateTonnage } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const formSchema = z.object({
  rows: z.array(z.object({
    panjang: z.coerce.number().min(1, "Required"),
    lebar: z.coerce.number().min(1, "Required"),
    substance: z.string().min(3, "Required"),
    flute: z.string().min(1, "Required"),
    diskon: z.coerce.number().min(0).max(100).optional().default(0),
  })),
});

type FormValues = z.infer<typeof formSchema>;

const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const fluteOptions = ["B", "C", "BC"];


export function PriceCalculatorForm() {
  const form = useForm<FormValues>({
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
  const [simulationData, setSimulationData] = React.useState<Record<number, { qty: number; total: number; totalWeight: number }>>({});
  const [isSimulating, setIsSimulating] = React.useState(false);

  const hasPriceError = watchedRows.some(row => calculatePrice({ ...row, diskon: row.diskon ?? 0 }) === null);

  const handleSimulationQtyChange = (index: number, value: string) => {
    const qty = parseInt(value) || 0;
    const rowData = watchedRows[index];
    const pricePerPcs = calculatePrice({ ...rowData, diskon: rowData.diskon ?? 0 });
    const moq = calculateMOQ(rowData);
    const weightPerPcsInTonnes = calculateTonnage({ ...rowData, quantity: 1 });

    if (pricePerPcs !== null && qty >= moq) {
      setSimulationData(prev => ({
        ...prev,
        [index]: { 
            qty, 
            total: qty * pricePerPcs,
            totalWeight: qty * weightPerPcsInTonnes
        }
      }));
    } else {
        setSimulationData(prev => {
            const newState = {...prev};
            newState[index] = { qty, total: 0, totalWeight: 0 };
            return newState;
        });
    }
  };

  const grandTotal = Object.values(simulationData).reduce((acc, curr) => acc + curr.total, 0);
  const grandTotalWeight = Object.values(simulationData).reduce((acc, curr) => acc + curr.totalWeight, 0);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-4">
          {/* Header only on desktop */}
          <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr_2fr_40px] gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground px-2">
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span>Substance</span>
            <span>F</span>
            <span>Disc%</span>
            <span className="text-right">Price / MOQ</span>
            <span></span>
          </div>

          <div className="space-y-4 md:space-y-2">
            {fields.map((field, index) => {
              const rowValues = watchedRows?.[index];
              const rowPrice = rowValues ? calculatePrice({ ...rowValues, diskon: rowValues.diskon ?? 0 }) : 0;
              const rowMOQ = rowValues ? calculateMOQ({ ...rowValues }) : 0;
              const isPriceNotFound = rowPrice === null;

              return (
                <div key={field.id} className="relative grid grid-cols-2 md:grid-cols-[1.5fr_1.5fr_2.5fr_1fr_1fr_2fr_40px] gap-x-3 gap-y-3 md:gap-y-0 md:gap-x-4 items-start bg-accent/20 dark:bg-accent/10 p-4 md:p-2 rounded-lg border md:border-none border-border/50">
                  
                  {/* Delete button on mobile - absolute top right */}
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
                      <FormControl><Input {...field} placeholder="Substance (e.g. K125/M125/K125)" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.flute`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Flute</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          const paperWeights = (form.getValues(`rows.${index}.substance`)).split('/').length;
                          if (value === 'BC' && paperWeights < 5) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100/M100/M100');
                          } else if (['B', 'C'].includes(value) && paperWeights > 3) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100');
                          }
                      }} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{fluteOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.diskon`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Disc%</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Disc%" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  
                  <div className="col-span-2 md:col-span-1 h-auto md:h-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono text-foreground bg-primary/5 md:bg-transparent p-2 md:p-0 rounded md:rounded-none">
                    <span className="md:hidden text-xs text-muted-foreground font-sans">Est. Price:</span>
                    <div className="flex flex-col items-end">
                      {isPriceNotFound ? (
                           <span className="text-xs text-destructive text-right">Not Found</span>
                      ) : (
                          <>
                              <span className="text-sm md:text-base font-bold text-primary md:text-foreground">{currencyFormatter.format(rowPrice ?? 0)}</span>
                              <span className="text-[10px] md:text-xs text-muted-foreground">{isFinite(rowMOQ) ? `${rowMOQ.toLocaleString()} pcs (MOQ)` : 'N/A'}</span>
                          </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full md:w-auto" size="sm" onClick={() => append({ panjang: 0, lebar: 0, substance: "M100/M100/M100", flute: "B", diskon: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>
        
        <Separator />

        {hasPriceError && (
             <Alert variant="destructive">
                <AlertDescription>
                    One or more items were not found in the price list. Please contact admin for assistance. The total shown below may be incorrect.
                </AlertDescription>
            </Alert>
        )}

        <Collapsible open={isSimulating} onOpenChange={setIsSimulating}>
            <CollapsibleTrigger asChild>
                <Button type="button" variant="secondary" className="w-full md:w-auto">
                    <Calculator className="mr-2 h-4 w-4"/>
                    Simulasi Total Harga (Base on QTY Order)
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-card/30 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Order Breakdown</CardTitle>
                            <CardDescription>Masukkan kuantitas pesanan untuk setiap item di bawah ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {watchedRows.map((row, index) => {
                                const moq = calculateMOQ(row);
                                const weightPerPcsInKg = calculateTonnage({ ...row, quantity: 1 }) * 1000;
                                const isQtyInvalid = (simulationData[index]?.qty ?? 0) > 0 && (simulationData[index]?.qty ?? 0) < moq;
                                const itemTotal = simulationData[index]?.total ?? 0;
                                const itemTotalWeight = simulationData[index]?.totalWeight ?? 0;

                                return (
                                    <div key={index} className="space-y-3">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-foreground break-words">
                                                    {`${row.panjang || 0}x${row.lebar || 0} (${row.substance || 'N/A'}) ${row.flute || ''}`}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground font-mono">
                                                    <Weight className="h-3 w-3" />
                                                    <span>{weightPerPcsInKg.toFixed(4)} kg/pcs</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                                                <Input
                                                    type="number"
                                                    placeholder={`min. ${moq.toLocaleString()}`}
                                                    className={`w-full sm:w-32 h-8 text-sm ${isQtyInvalid ? 'border-destructive' : ''}`}
                                                    value={simulationData[index]?.qty || ''}
                                                    onChange={(e) => handleSimulationQtyChange(index, e.target.value)}
                                                />
                                                {isQtyInvalid && <p className="text-[10px] text-destructive">Min. {moq.toLocaleString()} pcs</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end bg-muted/30 p-2 rounded-md">
                                            <div className="text-xs text-muted-foreground">
                                                <p>Est. Weight</p>
                                                <p className="font-mono text-foreground">{itemTotalWeight.toFixed(3)} tonnes</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">Subtotal</p>
                                                <p className="font-mono text-primary font-bold">{currencyFormatter.format(itemTotal)}</p>
                                            </div>
                                        </div>
                                        {index < watchedRows.length - 1 && <Separator className="mt-2 opacity-50"/>}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                    <Card className="bg-background sticky top-4 h-fit border-primary/20 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Total Summary (exc tax)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Estimated Price</p>
                                <p className="text-3xl md:text-4xl font-bold font-mono text-primary tracking-tight break-words">
                                    {currencyFormatter.format(grandTotal)}
                                </p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Estimated Weight</p>
                                <p className="text-2xl md:text-3xl font-bold font-mono text-foreground tracking-tight">
                                    {grandTotalWeight.toFixed(4)}
                                    <span className="text-base ml-2 font-sans font-medium text-muted-foreground">tonnes</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
}
