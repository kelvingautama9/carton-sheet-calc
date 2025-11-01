
"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { calculateMOQ } from "@/lib/calculations";
import { Separator } from "../ui/separator";

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

  const watchedValues = useWatch({
    control: form.control,
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground px-2">
            <span>Length (mm)</span>
            <span>Width (mm)</span>
            <span className="text-right">MOQ (sheets)</span>
            <span></span>
          </div>
          {fields.map((field, index) => {
            const rowValues = watchedValues.rows?.[index];
            const rowMOQ = rowValues && rowValues.panjang && rowValues.lebar ? calculateMOQ({ panjang: rowValues.panjang, lebar: rowValues.lebar }) : 0;

            return (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_80px] gap-x-4 items-start bg-accent/20 dark:bg-accent/10 p-2 rounded-lg">
                <FormField control={form.control} name={`rows.${index}.panjang`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="1000" /></FormControl><FormMessage/></FormItem>} />
                <FormField control={form.control} name={`rows.${index}.lebar`} render={({ field }) => <FormItem><FormControl><Input {...field} type="number" placeholder="500" /></FormControl><FormMessage/></FormItem>} />
                
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

        <Button type="button" variant="outline" size="sm" onClick={() => append({ panjang: 0, lebar: 0 })}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Row
        </Button>
      </form>
    </Form>
  );
}

    