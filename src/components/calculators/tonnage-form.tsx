'use client';

import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Weight } from 'lucide-react';
import { calculateTonnage } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  rows: z.array(
    z.object({
      panjang: z.coerce.number().min(1, 'Required'),
      lebar: z.coerce.number().min(1, 'Required'),
      substance: z.string().min(3, 'Required'),
      flute: z.string().min(1, 'Required'),
      quantity: z.coerce.number().min(1, 'Required'),
    })
  ),
});

const fluteOptions = ['B', 'C', 'BC'];

export function TonnageCalculatorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: [{ panjang: 0, lebar: 0, substance: 'M100/M100/M100', flute: 'B', quantity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const watchedRows = useWatch({
    control: form.control,
    name: 'rows',
  });

  const totalTonnage = (watchedRows || []).reduce((acc, row) => {
    const tonnage = calculateTonnage({
      panjang: Number(row?.panjang) || 0,
      lebar: Number(row?.lebar) || 0,
      substance: row?.substance || '',
      flute: row?.flute || 'B',
      quantity: Number(row?.quantity) || 0,
    });
    return acc + (isNaN(tonnage) ? 0 : tonnage);
  }, 0);

  const gridLayout = 'grid-cols-2 md:grid-cols-[1.2fr_1.2fr_2fr_0.8fr_1fr_1.8fr_48px]';

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-2">
          {/* Header Desktop - Disinkronkan dengan Row */}
          <div
            className={cn(
              'hidden md:grid gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70',
              gridLayout
            )}
          >
            <span>Length</span>
            <span>Width</span>
            <span>Substance</span>
            <span className="text-center">Flute</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Weight (tonnes)</span>
            <span></span>
          </div>

          <div className="space-y-4 md:space-y-2">
            {fields.map((field, index) => {
              const rowValues = watchedRows?.[index];
              const rowTonnage = calculateTonnage({
                panjang: Number(rowValues?.panjang) || 0,
                lebar: Number(rowValues?.lebar) || 0,
                substance: rowValues?.substance || '',
                flute: rowValues?.flute || 'B',
                quantity: Number(rowValues?.quantity) || 0,
              });

              const weightPerPcsInKg = calculateTonnage({
                  panjang: Number(rowValues?.panjang) || 0,
                  lebar: Number(rowValues?.lebar) || 0,
                  substance: rowValues?.substance || '',
                  flute: rowValues?.flute || 'B',
                  quantity: 1,
                }) * 1000;

              return (
                <div
                  key={field.id}
                  className={cn(
                    'relative grid gap-3 md:gap-4 items-start bg-accent/10 md:bg-transparent p-4 md:px-4 md:py-1 rounded-lg border md:border-none border-border/50',
                    gridLayout
                  )}
                >
                  {/* Delete button Mobile */}
                  <div className="absolute top-2 right-2 md:hidden">
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
                        <FormLabel className="md:hidden text-xs text-muted-foreground">Length (mm)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Length"
                            className="h-9 focus-visible:ring-primary/30"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.lebar`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-xs text-muted-foreground">Width (mm)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Width"
                            className="h-9 focus-visible:ring-primary/30"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.substance`}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1 space-y-1">
                        <FormLabel className="md:hidden text-xs text-muted-foreground">Substance</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. K125/M125/K125" className="h-9 focus-visible:ring-primary/30" />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`rows.${index}.flute`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-xs text-muted-foreground">Flute</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const currentSubstance = form.getValues(`rows.${index}.substance`);
                            const paperWeights = currentSubstance ? currentSubstance.split('/').length : 0;
                            if (value === 'BC' && paperWeights < 5) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100/M100/M100');
                            } else if (['B', 'C'].includes(value) && paperWeights > 3) {
                              form.setValue(`rows.${index}.substance`, 'M100/M100/M100');
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-9 focus:ring-primary/30">
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
                    name={`rows.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="md:hidden text-xs text-muted-foreground">Quantity</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Qty"
                            className="h-9 focus-visible:ring-primary/30"
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 md:col-span-1 h-auto md:h-9 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono text-foreground bg-primary/5 md:bg-transparent p-2 md:p-0 rounded md:rounded-none">
                    <span className="md:hidden text-xs text-muted-foreground font-sans tracking-tight">Row Weight:</span>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-primary md:text-foreground leading-none">
                        {isNaN(rowTonnage) ? '0.000' : rowTonnage.toFixed(3)}
                        <span className="md:hidden ml-1 text-[10px] font-sans font-medium text-muted-foreground">tonnes</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 font-sans font-medium flex items-center gap-1">
                        <Weight className="h-2.5 w-2.5" />
                        {weightPerPcsInKg.toFixed(4)} kg/pcs
                      </span>
                    </div>
                  </div>

                  {/* Delete Button Desktop */}
                  <div className="hidden md:flex items-center justify-end h-9">
                    {fields.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
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

        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto border-dashed hover:border-primary/50"
          onClick={() => append({ panjang: 0, lebar: 0, substance: 'M100/M100/M100', flute: 'B', quantity: 0 })}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Item
        </Button>

        <Separator />

        <div className="flex justify-end pt-4">
          <Card className="w-full max-w-sm bg-primary/5 border-primary/20 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="h-1 bg-primary w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Tonnage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black font-mono text-primary tracking-tighter">
                {totalTonnage.toFixed(4)}
                <span className="text-sm ml-2 font-sans font-bold text-muted-foreground/60 uppercase">tonnes</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
