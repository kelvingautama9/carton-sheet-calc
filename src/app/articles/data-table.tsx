
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Article = {
    id: string
    nama_artikel: string
    ukuran: string
    substance: string
    flute: string
}

export function DataTable({ data }: { data: Article[] }) {
  const [filter, setFilter] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Article; direction: "asc" | "desc" } | null>({ key: 'nama_artikel', direction: 'asc' });

  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
  }, [filteredData, sortConfig]);

  const requestSort = (key: keyof Article) => {
    let direction: "asc" | "desc" = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const columns: {key: keyof Article, header: string, isSortable: boolean, align?: 'right'}[] = [
    { key: 'nama_artikel', header: 'Artikel', isSortable: true },
    { key: 'ukuran', header: 'Ukuran (PxL)', isSortable: true },
    { key: 'substance', header: 'Substance', isSortable: true },
    { key: 'flute', header: 'Flute', isSortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          placeholder="Cari artikel, ukuran, atau spesifikasi..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-md bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30"
        />
      </div>
      <div className="rounded-md border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key} className={cn('p-0 h-12', col.align === 'right' && 'text-right')}>
                    {col.isSortable ? (
                        <Button variant="ghost" onClick={() => requestSort(col.key)} className="w-full h-full justify-start font-bold uppercase text-[11px] tracking-wider hover:bg-primary/10 hover:text-primary transition-colors">
                            {col.header}
                            {sortConfig?.key === col.key && <ArrowUpDown className="ml-2 h-4 w-4 text-primary" />}
                        </Button>
                    ) : (
                        <span className="px-4 font-bold uppercase text-[11px] tracking-wider">{col.header}</span>
                    )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-primary/5 transition-colors border-border/30">
                    <TableCell className="font-bold text-foreground py-3">{row.nama_artikel}</TableCell>
                    <TableCell className="font-mono text-xs">{row.ukuran}</TableCell>
                    <TableCell className="text-muted-foreground">{row.substance}</TableCell>
                    <TableCell className="font-semibold">{row.flute}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Data tidak ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
