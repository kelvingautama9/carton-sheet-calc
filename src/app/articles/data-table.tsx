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
    panjang_sheet: number
    lebar_sheet: number
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
    { key: 'nama_artikel', header: 'Article Name', isSortable: true },
    { key: 'flute', header: 'Flute', isSortable: true },
    { key: 'substance', header: 'Substance', isSortable: true },
    { key: 'panjang_sheet', header: 'Length (mm)', isSortable: true, align: 'right' },
    { key: 'lebar_sheet', header: 'Width (mm)', isSortable: true, align: 'right' },
  ];

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter articles..."
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map(col => (
                <TableHead key={col.key} className={cn('p-0 h-12', col.align === 'right' && 'text-right')}>
                    {col.isSortable ? (
                        <Button variant="ghost" onClick={() => requestSort(col.key)} className="w-full justify-start data-[align=right]:justify-end">
                            {col.header}
                            {sortConfig?.key === col.key && <ArrowUpDown className="ml-2 h-4 w-4" />}
                        </Button>
                    ) : (
                        col.header
                    )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row) => (
                <TableRow key={row.id} data-state="false">
                    <TableCell className="font-medium">{row.nama_artikel}</TableCell>
                    <TableCell>{row.flute}</TableCell>
                    <TableCell>{row.substance}</TableCell>
                    <TableCell className="text-right">{row.panjang_sheet}</TableCell>
                    <TableCell className="text-right">{row.lebar_sheet}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
