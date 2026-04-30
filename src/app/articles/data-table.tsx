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
import { ArrowUpDown, ChevronLeft, Search, FolderOpen, Database } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const groups = React.useMemo(() => {
    const groupSet = new Set<string>();
    data.forEach(item => {
      const parts = item.nama_artikel.split('-');
      if (parts.length > 1) {
        groupSet.add(parts[1]);
      }
    });
    return Array.from(groupSet).sort();
  }, [data]);

  const filteredData = React.useMemo(() => {
    let result = data;
    if (selectedGroup) {
      result = result.filter(item => item.nama_artikel.includes(`-${selectedGroup}-`));
    } else {
        return [];
    }
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
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
    { key: 'nama_artikel', header: 'Artikel ID', isSortable: true },
    { key: 'ukuran', header: 'Ukuran (PxL)', isSortable: true },
    { key: 'substance', header: 'Substance', isSortable: true },
    { key: 'flute', header: 'FLT', isSortable: true },
  ];

  if (!selectedGroup) {
    return (
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20">
                <Database className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter">SELECT DATASET</h3>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em]">Choose a category ID to initialize database</p>
            </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {groups.map((group, idx) => (
            <Button
              key={group}
              variant="outline"
              className={cn(
                "h-32 flex flex-col gap-3 glass-panel hover:bg-primary/10 hover:border-primary transition-all duration-500 group relative overflow-hidden",
                `animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both`
              )}
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => setSelectedGroup(group)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <FolderOpen className="h-6 w-6 text-primary group-hover:scale-125 transition-transform" />
              <span className="text-2xl font-black tracking-widest font-mono">{group}</span>
              <span className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.1em]">
                {data.filter(item => item.nama_artikel.includes(`-${group}-`)).length} ENTRIES
              </span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                    setSelectedGroup(null);
                    setFilter("");
                }}
                className="hover:bg-primary/10 text-primary font-black uppercase tracking-widest text-xs"
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Reset Dataset
            </Button>
            <div className="h-6 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Active ID:</span>
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-black tracking-widest shadow-lg shadow-primary/20">{selectedGroup}</span>
            </div>
        </div>

        <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Query database..."
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="pl-12 bloomberg-input h-11 rounded-xl"
            />
        </div>
      </div>

      <div className="rounded-2xl glass-panel overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/5">
            <TableRow className="hover:bg-transparent">
              {columns.map(col => (
                <TableHead key={col.key} className={cn('p-0 h-14', col.align === 'right' && 'text-right')}>
                    {col.isSortable ? (
                        <Button variant="ghost" onClick={() => requestSort(col.key)} className="w-full h-full justify-start font-black uppercase text-[10px] tracking-[0.2em] hover:bg-primary/10 hover:text-primary transition-all rounded-none">
                            {col.header}
                            {sortConfig?.key === col.key && <ArrowUpDown className="ml-2 h-3 w-3 text-primary" />}
                        </Button>
                    ) : (
                        <span className="px-4 font-black uppercase text-[10px] tracking-[0.2em]">{col.header}</span>
                    )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((row, idx) => (
                <TableRow 
                    key={row.id} 
                    className="hover:bg-primary/5 transition-all duration-300 border-white/5 animate-in fade-in slide-in-from-left-4 fill-mode-both"
                    style={{ animationDelay: `${idx * 20}ms` }}
                >
                    <TableCell className="font-black text-foreground py-4 font-mono tracking-tight text-sm">{row.nama_artikel}</TableCell>
                    <TableCell className="font-mono text-xs text-primary/80">{row.ukuran}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-medium">{row.substance}</TableCell>
                    <TableCell className="text-center md:text-left">
                        <span className="bg-white/5 px-3 py-1 rounded-md text-[10px] font-black border border-white/5">{row.flute}</span>
                    </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                    <Search className="h-12 w-12 opacity-10 animate-pulse" />
                    <p className="font-black uppercase tracking-[0.3em] text-xs">No result matching query</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between px-2 text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em]">
        <span>Buffer: {sortedData.length} Records</span>
        <span className="text-primary/40 italic">Terminal Secured</span>
      </div>
    </div>
  );
}