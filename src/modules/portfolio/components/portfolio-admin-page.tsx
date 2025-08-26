"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioItem } from "@/modules/portfolio/portfolio.schema";
import { GripVertical, PlusCircle, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Input } from "@/components/ui/input";

// Simplified version for portfolio items
export default function PortfolioAdminPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<PortfolioItem[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/portfolio");
        const fetchedData: PortfolioItem[] = await res.json();
        setItems(fetchedData);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch portfolio" });
      }
    }
    fetchData();
  }, [toast]);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/portfolio?id=${itemToDelete}`, { method: 'DELETE' });
      setItems(prev => prev?.filter(item => item.id !== itemToDelete) || null);
      toast({ title: "Item deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete item" });
    } finally {
      setItemToDelete(null);
    }
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (!items) return;
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
  };

  const handleSaveOrder = async () => {
    if (!items) return;
    setIsSaving(true);
    try {
        const orderedIds = items.map(item => item.id);
        const res = await fetch('/api/portfolio/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds })
        });
        if (!res.ok) throw new Error("Failed to save order");
        const updatedItems = await res.json();
        setItems(updatedItems);
        toast({ title: "Success!", description: "Portfolio order saved." });
    } catch (error) {
        toast({ variant: 'destructive', title: "Failed to save order." });
    } finally {
        setIsSaving(false);
    }
  };

  const handleAddItem = async () => {
    const newItem = {
        title: "New Project",
        description: "A brief description of the new project.",
        category: "Video",
        imageUrl: `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`,
        'data-ai-hint': 'project placeholder',
    };
    try {
        const res = await fetch('/api/portfolio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem),
        });
        if(!res.ok) throw new Error('Failed to add item');
        const addedItem = await res.json();
        setItems(prev => [...(prev || []), addedItem]);
        toast({ title: "Item added"});
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to add item.' });
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Portfolio</h1>
        <div>
            <Button onClick={handleAddItem} variant="outline" className="mr-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <Button onClick={handleSaveOrder} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Order
            </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Items</CardTitle>
          <CardDescription>Reorder items and manage their content.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!items ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
            ) : (
              items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 p-2 border rounded-lg bg-background">
                  <div className="flex flex-col items-center pt-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab my-1" />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(index, 'down')} disabled={index === items.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative h-24 w-36 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <Input defaultValue={item.title} className="font-bold" placeholder="Project Title" />
                    <Input defaultValue={item.description} placeholder="Project Description" />
                    <Input defaultValue={item.category} placeholder="Category" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id)} className="mt-2">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This will permanently delete the portfolio item."
        confirmText="Delete"
      />
    </div>
  );
}
