'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Calculator, Weight, TrendingUp } from 'lucide-react';
import { calculatePrice, calculateMOQ, calculateTonnage } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  rows: z.array(
    z.object({
      panjang: z.coerce.number().min(1, 'Required'),
      lebar: z.coerce.number().min(1, 'Required'),
      substance: z.string().min(3, 'Required'),
      flute: z.string().min(1, 'Required'),
      diskon: z.coerce.number().optional().default(0),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

const currencyFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 });
const fluteOptions = ['B', 'C', 'BC'];

export function PriceCalculatorForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: [{ panjang: 0, lebar: 0, substance: 'K125/M125/K125', flute: 'B', diskon: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const watchedRows = form.watch('rows');
  const [simulationData, setSimulationData] = React.useState<Record<number, { qty: number; total: number; totalWeight: number }>>({});
  const [isSimulating, setIsSimulating] = React.useState(false);

  const hasPriceError = watchedRows.some((row) => calculatePrice({ ...row, diskon: row.diskon ?? 0 }) === null);

  const handleSimulationQtyChange = (index: number, value: string) => {
    const qty = parseInt(value) || 0;
    const rowData = watchedRows[index];
    const pricePerPcs = calculatePrice({ ...rowData, diskon: rowData.diskon ?? 0 });
    const moq = calculateMOQ(rowData);
    const weightPerPcsInTonnes = calculateTonnage({ ...rowData, quantity: 1 });

    if (pricePerPcs !== null && qty >= moq) {
      setSimulationData((prev) => ({
        ...prev,
        [index]: {
          qty,
          total: qty * pricePerPcs,
          totalWeight: qty * weightPerPcsInTonnes,
        },
      }));
    } else {
      setSimulationData((prev) => {
        const newState = { ...prev };
        newState[index] = { qty, total: 0, totalWeight: 0 };
        return newState;
      });
    }
  };

  const grandTotal = Object.values(simulationData).reduce((acc, curr) => acc + curr.total, 0);
  const grandTotalWeight = Object.values(simulationData).reduce((acc, curr) => acc + curr.totalWeight, 0);

  const gridLayout = 'grid-cols-2 md:grid-cols-[1fr_1fr_2.2fr_0.8fr_0.8fr_1.8fr_48px]';

  return (
    <Form {...form}>
      <form className="space-y-8">
        <div className="space-y-4">
          <div
            className={cn(
              'hidden md:grid gap-4 px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 bg-white/5 rounded-xl border border-white/5',
              gridLayout
            )}
          >
            <span>Length</span>
            <span>Width</span>
            <span>Substance</span>
            <span className="text-center">Flt</span>
            <span className="text-center">Disc</span>
            <span className="text-right">Price @MOQ</span>
            <span></span>
          </div>

          <div className="space-y-4 md:space-y-3">
            {fields.map((field, index) => {
              const rowValues = watchedRows?.[index];
              const rowPrice = rowValues ? calculatePrice({ ...rowValues, diskon: rowValues.diskon ?? 0 }) : 0;
              const rowMOQ = rowValues ? calculateMOQ({ ...rowValues }) : 0;
              const isPriceNotFound = rowPrice === null;

              return (
                <div
                  key={field.id}
                  className={cn(
                    'relative grid gap-3 md:gap-4 items-center glass-panel p-5 md:px-6 md:py-2 rounded-2xl group transition-all duration-300 hover:bg-white/5',
                    gridLayout
                  )}
                >
                  <div className="absolute top-3 right-3 md:hidden">
                    {fields.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`rows.${index}.panjang`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Length (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            className="h-10 bloomberg-input font-mono"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.lebar`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Width (mm)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            className="h-10 bloomberg-input font-mono"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.substance`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1 space-y-1">
                        <FormLabel className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Substance</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-10 bloomberg-input font-mono text-xs" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.flute`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Flt</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-10 bloomberg-input font-bold">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fluteOptions.map((f) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.diskon`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Disc%</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            className="h-10 bloomberg-input font-mono text-center"
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 md:col-span-1 h-auto md:h-10 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono bg-primary/5 md:bg-transparent p-3 md:p-0 rounded-xl">
                    <span className="md:hidden text-[10px] font-black uppercase text-muted-foreground">Est. Value:</span>
                    <div className="flex flex-col items-end">
                      {isPriceNotFound ? (
                        <span className="text-xs text-destructive font-black animate-pulse">NO PRICE</span>
                      ) : (
                        <>
                          <span className="text-base md:text-lg font-black text-primary drop-shadow-[0_0_8px_rgba(255,184,0,0.3)]">
                            {currencyFormatter.format(rowPrice ?? 0)}
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter opacity-60">
                            {isFinite(rowMOQ) ? `MOQ ${rowMOQ.toLocaleString()} pcs` : 'N/A'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-end">
                    {fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-xl"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full sm:w-auto glass-panel border-dashed hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={() => append({ panjang: 0, lebar: 0, substance: 'M100/M100/M100', flute: 'B', diskon: 0 })}
          >
            <PlusCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" /> Add Terminal Row
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-12 w-full sm:w-auto font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 transition-all shadow-xl"
            onClick={() => setIsSimulating(!isSimulating)}
          >
            <Calculator className="mr-2 h-5 w-5" />
            {isSimulating ? 'Hide Analysis' : 'Run Calculation'}
          </Button>
        </div>

        <Separator className="bg-white/5" />

        {hasPriceError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 animate-in shake duration-500">
            <AlertDescription className="text-xs font-bold uppercase tracking-widest">
              SYSTEM ERROR: Some datasets missing prices. Contact admin for manual override.
            </AlertDescription>
          </Alert>
        )}

        <Collapsible open={isSimulating} onOpenChange={setIsSimulating}>
          <CollapsibleContent className="mt-8 animate-in slide-in-from-top-4 duration-500">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 glass-panel p-0 overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                  <CardTitle className="text-xl font-black tracking-tight">EXECUTION BREAKDOWN</CardTitle>
                  <CardDescription className="uppercase text-[10px] font-black tracking-[0.3em] text-muted-foreground">
                    Input order volume per sequence
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {watchedRows.map((row, index) => {
                    const moq = calculateMOQ(row);
                    const weightPerPcsInKg = calculateTonnage({ ...row, quantity: 1 }) * 1000;
                    const isQtyInvalid = (simulationData[index]?.qty ?? 0) > 0 && (simulationData[index]?.qty ?? 0) < moq;
                    const itemTotal = simulationData[index]?.total ?? 0;
                    const itemTotalWeight = simulationData[index]?.totalWeight ?? 0;

                    return (
                      <div key={index} className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                          <div className="space-y-1">
                            <p className="text-lg font-black tracking-tight flex items-center gap-2">
                              <span className="text-primary/60 text-sm font-mono">{index + 1}.</span>
                              {`${row.panjang || 0}x${row.lebar || 0}`}
                              <span className="text-xs text-muted-foreground font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                {row.substance} ({row.flute})
                              </span>
                            </p>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-primary/40 uppercase tracking-widest">
                              <Weight className="h-3 w-3" />
                              <span>NET: {weightPerPcsInKg.toFixed(4)} KG/pcs</span>
                            </div>
                          </div>
                          <div className="w-full sm:w-40 space-y-1">
                            <Input
                              type="number"
                              placeholder={`MIN ${moq}`}
                              className={cn('h-10 bloomberg-input font-black text-center', isQtyInvalid && 'border-destructive ring-destructive/20 text-destructive')}
                              value={simulationData[index]?.qty || ''}
                              onChange={(e) => handleSimulationQtyChange(index, e.target.value)}
                            />
                            {isQtyInvalid && <p className="text-[10px] text-destructive font-black uppercase text-center tracking-tighter">BELOW MOQ LIMIT</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Total Weight</p>
                            <p className="font-mono text-foreground font-black text-base">
                              {itemTotalWeight.toFixed(3)} <span className="text-[10px] opacity-40">TONS</span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mb-1">Subtotal</p>
                            <p className="font-mono text-primary font-black text-base drop-shadow-[0_0_10px_rgba(255,184,0,0.2)]">
                              {currencyFormatter.format(itemTotal)}
                            </p>
                          </div>
                        </div>
                        {index < watchedRows.length - 1 && <Separator className="bg-white/5" />}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="glass-panel overflow-hidden border-primary/20 sticky top-24 shadow-2xl">
                  <div className="h-1.5 bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse w-full" />
                  <CardHeader className="p-6 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground">CONSOLIDATED DATA</CardTitle>
                      <TrendingUp className="h-4 w-4 text-primary animate-bounce" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-10">
                    <div className="space-y-2">
                      <p className="text-[11px] text-primary/60 uppercase tracking-[0.2em] font-black">Gross Revenue (Exc. Tax)</p>
                      <p className="text-4xl font-black font-mono text-primary tracking-tighter drop-shadow-[0_0_20px_rgba(255,184,0,0.4)]">
                        {currencyFormatter.format(grandTotal)}
                      </p>
                    </div>
                    <div className="h-[1px] bg-gradient-to-r from-white/10 via-transparent to-transparent" />
                    <div className="space-y-2">
                      <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em] font-black">Gross Tonnage</p>
                      <p className="text-3xl font-black font-mono text-foreground tracking-tighter">
                        {grandTotalWeight.toFixed(4)}
                        <span className="text-xs ml-3 font-sans font-black text-muted-foreground uppercase">Ton</span>
                      </p>
                    </div>
                    <Button className="w-full h-12 bg-primary text-primary-foreground font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20">
                      Export Analysis
                    </Button>
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
