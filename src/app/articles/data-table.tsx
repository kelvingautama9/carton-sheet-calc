
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
import { ArrowUpDown, ChevronLeft, Search, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type Article = {
    id: string
    nama_artikel: string
    ukuran: string
    substance: string
    flute: string
}

export function DataTable({ data }: { data: Article[] }) {
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Article; direction: "asc" | "desc" } | null>({ key: 'nama_artikel', direction: 'asc' });

  // Ekstrak Group ID dari nama_artikel (Format: SH-G003-XXXXX-X)
  const groups = React.useMemo(() => {
    const groupSet = new Set<string>();
    data.forEach(item => {
      const parts = item.nama_artikel.split('-');
      if (parts.length > 1) {
        groupSet.add(parts[1]); // Mengambil G003
      }
    });
    return Array.from(groupSet).sort();
  }, [data]);

  const filteredData = React.useMemo(() => {
    let result = data;
    
    // Filter berdasarkan Group jika terpilih
    if (selectedGroup) {
      result = result.filter(item => item.nama_artikel.includes(`-${selectedGroup}-`));
    } else {
        // Jika tidak ada group terpilih, kita tidak menampilkan data di tabel
        return [];
    }

    // Filter berdasarkan input pencarian
    return result.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, selectedGroup, filter]);

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

  if (!selectedGroup) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2 mb-8">
            <h3 className="text-xl font-bold text-foreground">Pilih ID Kategori</h3>
            <p className="text-sm text-muted-foreground">Silakan pilih ID untuk melihat daftar spesifikasi artikel.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {groups.map(group => (
            <Button
              key={group}
              variant="outline"
              className="h-24 flex flex-col gap-2 bg-card/40 backdrop-blur-md border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group"
              onClick={() => setSelectedGroup(group)}
            >
              <FolderOpen className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg font-black tracking-widest">{group}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold">
                {data.filter(item => item.nama_artikel.includes(`-${group}-`)).length} Items
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                    setSelectedGroup(null);
                    setFilter("");
                }}
                className="hover:bg-primary/10 text-primary font-bold"
            >
                <ChevronLeft className="mr-1 h-4 w-4" /> Kembali
            </Button>
            <div className="h-8 w-[1px] bg-border/50 hidden md:block" />
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Category:</span>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-black tracking-widest">{selectedGroup}</span>
            </div>
        </div>

        <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Cari artikel atau ukuran..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30"
            />
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/20">
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
                    <TableCell className="font-bold text-foreground py-3 min-w-[150px]">{row.nama_artikel}</TableCell>
                    <TableCell className="font-mono text-xs">{row.ukuran}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{row.substance}</TableCell>
                    <TableCell className="font-semibold text-center md:text-left">{row.flute}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8 opacity-20" />
                    <p>Tidak ada data yang cocok dengan pencarian Anda.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
        <span>Menampilkan {sortedData.length} hasil</span>
        <span>ID {selectedGroup}</span>
      </div>
    </div>
  );
}
