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

  // Definisi Grid Column yang identik untuk header dan row
  const gridLayout = "grid-cols-2 md:grid-cols-[1.2fr_1.2fr_2.5fr_0.8fr_0.8fr_1.8fr_48px]";

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-2">
          {/* Header Desktop - Disinkronkan dengan Row */}
          <div className={clsx("hidden md:grid gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70", gridLayout)}>
            <span>Length</span>
            <span>Width</span>
            <span>Substance</span>
            <span className="text-center">Flute</span>
            <span className="text-center">Disc%</span>
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
                <div key={field.id} className={clsx("relative grid gap-3 md:gap-4 items-start bg-accent/10 md:bg-transparent p-4 md:px-4 md:py-1 rounded-lg border md:border-none border-border/50", gridLayout)}>
                  
                  {/* Delete button Mobile */}
                  <div className="absolute top-2 right-2 md:hidden">
                    {fields.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField control={form.control} name={`rows.${index}.panjang`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Length (mm)</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Length" className="h-9 focus-visible:ring-primary/30" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Width (mm)</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="Width" className="h-9 focus-visible:ring-primary/30" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.substance`} render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1 space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Substance</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. K125/M125/K125" className="h-9 focus-visible:ring-primary/30" /></FormControl>
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
                        <FormControl><SelectTrigger className="h-9 focus:ring-primary/30"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{fluteOptions.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.diskon`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Disc%</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="%" className="h-9 focus-visible:ring-primary/30" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  
                  <div className="col-span-2 md:col-span-1 h-auto md:h-9 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono text-foreground bg-primary/5 md:bg-transparent p-2 md:p-0 rounded md:rounded-none">
                    <span className="md:hidden text-xs text-muted-foreground font-sans">Est. Price:</span>
                    <div className="flex flex-col items-end">
                      {isPriceNotFound ? (
                           <span className="text-xs text-destructive font-bold">Not Found</span>
                      ) : (
                          <>
                              <span className="text-sm md:text-base font-bold text-primary md:text-foreground leading-none">{currencyFormatter.format(rowPrice ?? 0)}</span>
                              <span className="text-[10px] md:text-[11px] text-muted-foreground mt-0.5">{isFinite(rowMOQ) ? `${rowMOQ.toLocaleString()} pcs (MOQ)` : 'N/A'}</span>
                          </>
                      )}
                    </div>
                  </div>

                  {/* Delete Button Desktop */}
                  <div className="hidden md:flex items-center justify-end h-9">
                    {fields.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="button" variant="outline" className="w-full sm:w-auto border-dashed hover:border-primary/50" onClick={() => append({ panjang: 0, lebar: 0, substance: "M100/M100/M100", flute: "B", diskon: 0 })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={() => setIsSimulating(!isSimulating)}>
                <Calculator className="mr-2 h-4 w-4"/>
                {isSimulating ? "Sembunyikan Simulasi" : "Simulasi Total Harga"}
            </Button>
        </div>
        
        <Separator />

        {hasPriceError && (
             <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
                <AlertDescription className="text-xs">
                    Beberapa item tidak ditemukan dalam daftar harga. Silakan hubungi admin untuk konfirmasi harga manual.
                </AlertDescription>
            </Alert>
        )}

        <Collapsible open={isSimulating} onOpenChange={setIsSimulating}>
            <CollapsibleContent className="mt-4 animate-in slide-in-from-top-2 duration-300">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-card/30 backdrop-blur-sm lg:col-span-2">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg">Order Breakdown</CardTitle>
                            <CardDescription>Masukkan kuantitas pesanan untuk setiap item.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {watchedRows.map((row, index) => {
                                const moq = calculateMOQ(row);
                                const weightPerPcsInKg = calculateTonnage({ ...row, quantity: 1 }) * 1000;
                                const isQtyInvalid = (simulationData[index]?.qty ?? 0) > 0 && (simulationData[index]?.qty ?? 0) < moq;
                                const itemTotal = simulationData[index]?.total ?? 0;
                                const itemTotalWeight = simulationData[index]?.totalWeight ?? 0;

                                return (
                                    <div key={index} className="group">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                                    {`${row.panjang || 0}x${row.lebar || 0} (${row.substance || '-'}) ${row.flute || ''}`}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground font-mono">
                                                    <Weight className="h-3 w-3" />
                                                    <span>{weightPerPcsInKg.toFixed(4)} kg/pcs</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 w-full sm:w-32">
                                                <Input
                                                    type="number"
                                                    placeholder={`min. ${moq.toLocaleString()}`}
                                                    className={clsx("h-8 text-sm focus-visible:ring-primary/30", isQtyInvalid && 'border-destructive ring-destructive/20')}
                                                    value={simulationData[index]?.qty || ''}
                                                    onChange={(e) => handleSimulationQtyChange(index, e.target.value)}
                                                />
                                                {isQtyInvalid && <p className="text-[10px] text-destructive font-medium">Min. {moq.toLocaleString()} pcs</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between items-end bg-accent/5 p-2 rounded-md mt-2">
                                            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                                                <p>Est. Weight</p>
                                                <p className="font-mono text-foreground text-sm">{itemTotalWeight.toFixed(3)} tonnes</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">Subtotal</p>
                                                <p className="font-mono text-primary font-bold text-sm">{currencyFormatter.format(itemTotal)}</p>
                                            </div>
                                        </div>
                                        {index < watchedRows.length - 1 && <Separator className="mt-4 opacity-30"/>}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20 sticky top-20 shadow-xl shadow-primary/5 overflow-hidden">
                            <div className="h-1 bg-primary w-full" />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base uppercase tracking-widest text-muted-foreground">Summary (Exc. Tax)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Estimated Price</p>
                                    <p className="text-3xl font-black font-mono text-primary tracking-tighter">
                                        {currencyFormatter.format(grandTotal)}
                                    </p>
                                </div>
                                <Separator className="bg-primary/10" />
                                <div>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Estimated Weight</p>
                                    <p className="text-2xl font-black font-mono text-foreground tracking-tighter">
                                        {grandTotalWeight.toFixed(4)}
                                        <span className="text-sm ml-2 font-sans font-bold text-muted-foreground/60 uppercase">tonnes</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
