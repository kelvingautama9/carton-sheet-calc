"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculateMOQ, FLUTE_TAKEUP_FACTORS } from "@/lib/calculations";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  minTonnage: z.coerce.number().min(0, "Tonnage must be positive"),
  rows: z.array(z.object({
    panjang: z.coerce.number().min(1, "Required"),
    lebar: z.coerce.number().min(1, "Required"),
    substance: z.string().min(3, "Required"),
    flute: z.string().min(1, "Required"),
  })),
});

export function MoqCalculatorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minTonnage: 1,
      rows: [{ panjang: 0, lebar: 0, substance: "", flute: "B" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const watchedValues = useWatch({
    control: form.control,
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
         <div className="max-w-xs">
          <FormField
            control={form.control}
            name="minTonnage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Tonnage</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator/>
        <div className="space-y-4">
          <div className="grid grid-cols-[2fr_2fr_3fr_2fr_2fr_1fr] gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground px-2">
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span>Substance</span>
            <span>Flute</span>
            <span className="text-right">MOQ (sheets)</span>
            <span></span>
          </div>
          {fields.map((field, index) => {
            const rowValues = watchedValues.rows?.[index];
            const rowMOQ = rowValues ? calculateMOQ({ ...rowValues, minTonnage: watchedValues.minTonnage }) : 0;

            return (
              <div key={field.id} className="grid grid-cols-[2fr_2fr_3fr_2fr_2fr_1fr] gap-x-4 items-start bg-accent/20 dark:bg-accent/10 p-2 rounded-lg">
                <FormField control={form.control} name={`rows.${index}.panjang`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="1200" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="800" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.substance`} render={({ field }) => <FormItem><FormControl><Input {...field} placeholder="125/110/125" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.flute`} render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>{Object.keys(FLUTE_TAKEUP_FACTORS).map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                    </Select>
                  </FormItem>
                )} />
                
                <div className="h-10 flex items-center justify-end font-mono text-lg font-semibold text-primary">
                  {isFinite(rowMOQ) ? rowMOQ.toLocaleString() : "N/A"}
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

        <Button type="button" variant="outline" size="sm" onClick={() => append({ panjang: 0, lebar: 0, substance: "", flute: "B" })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Row
        </Button>
      </form>
    </Form>
  );
}
