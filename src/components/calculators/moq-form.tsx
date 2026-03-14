"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculateMOQ } from "@/lib/calculations";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  rows: z.array(z.object({
    panjang: z.coerce.number().min(1, "Required"),
    lebar: z.coerce.number().min(1, "Required"),
  })),
});

export function MoqCalculatorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rows: [{ panjang: 0, lebar: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  });

  const watchedRows = useWatch({
    control: form.control,
    name: "rows"
  });

  const gridLayout = "grid-cols-2 md:grid-cols-[1.5fr_1.5fr_1.5fr_48px]";

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-2">
          {/* Header Desktop */}
          <div className={cn("hidden md:grid gap-4 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/70", gridLayout)}>
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span className="text-right">MOQ (sheets)</span>
            <span></span>
          </div>

          <div className="space-y-4 md:space-y-2">
            {fields.map((field, index) => {
              const rowValues = watchedRows?.[index];
              const panjang = Number(rowValues?.panjang) || 0;
              const lebar = Number(rowValues?.lebar) || 0;
              const rowMOQ = panjang > 0 && lebar > 0 ? calculateMOQ({ panjang, lebar }) : 0;

              return (
                <div key={field.id} className={cn("relative grid gap-3 md:gap-4 items-start bg-accent/10 md:bg-transparent p-4 md:px-4 md:py-1 rounded-lg border md:border-none border-border/50", gridLayout)}>
                  
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
                      <FormControl><Input {...field} type="number" placeholder="1000" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="md:hidden text-xs text-muted-foreground">Width (mm)</FormLabel>
                      <FormControl><Input {...field} type="number" placeholder="500" className="h-9" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  
                  <div className="col-span-2 md:col-span-1 h-auto md:h-9 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center font-mono text-foreground bg-primary/5 md:bg-transparent p-2 md:p-0 rounded md:rounded-none">
                    <span className="md:hidden text-xs text-muted-foreground font-sans">Min. Order (MOQ):</span>
                    <span className="text-base md:text-lg font-bold text-primary md:text-foreground leading-none">
                      {isFinite(rowMOQ) ? rowMOQ.toLocaleString() : "N/A"}
                      <span className="md:hidden ml-1 text-xs font-sans font-medium text-muted-foreground">sheets</span>
                    </span>
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

        <Button type="button" variant="outline" className="w-full sm:w-auto border-dashed hover:border-primary/50" onClick={() => append({ panjang: 0, lebar: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Row
        </Button>
      </form>
    </Form>
  );
}
