"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { PortfolioItem } from "@/modules/portfolio/portfolio.schema";
import { GripVertical, PlusCircle, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const portfolioSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    category: z.string().min(1, "Category is required"),
    imageUrl: z.string().url(),
    'data-ai-hint': z.string().optional(),
    order: z.number(),
  }))
});

export default function PortfolioAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof portfolioSchema>>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: { items: [] },
  });
  
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/portfolio");
        const fetchedData: PortfolioItem[] = await res.json();
        form.reset({ items: fetchedData });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch portfolio" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/portfolio?id=${itemToDelete}`, { method: 'DELETE' });
      const currentItems = form.getValues('items');
      form.setValue('items', currentItems.filter(item => item.id !== itemToDelete));
      toast({ title: "Item deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete item" });
    } finally {
      setItemToDelete(null);
    }
  };

  const handleSaveAll = async (data: z.infer<typeof portfolioSchema>) => {
    setIsSubmitting(true);
    try {
      // Save order
      const orderedIds = data.items.map(item => item.id);
      await fetch('/api/portfolio/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds })
      });
      
      // Save individual item content
      for(const item of data.items) {
        await fetch(`/api/portfolio?id=${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      toast({ title: "Success!", description: "Portfolio updated successfully." });
    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save portfolio." });
    } finally {
      setIsSubmitting(false);
    }
  }

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
        append(addedItem);
        toast({ title: "Item added"});
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to add item.' });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAll)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Portfolio</h1>
            <div>
              <Button type="button" onClick={handleAddItem} variant="outline" className="mr-2">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Item
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save All Changes
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Items</CardTitle>
              <CardDescription>Reorder items and manage their content. Remember to save all changes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.length === 0 && !form.formState.isValidating ? (
                  Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                      <div className="flex flex-col items-center pt-2">
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(index, index - 1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab my-1" />
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative h-24 w-36 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={field.imageUrl} alt={field.title} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.title`}
                          render={({ field }) => <FormItem><FormControl><Input {...field} className="font-bold" placeholder="Project Title" /></FormControl></FormItem>}
                        />
                         <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => <FormItem><FormControl><Input {...field} placeholder="Project Description" /></FormControl></FormItem>}
                        />
                         <FormField
                          control={form.control}
                          name={`items.${index}.category`}
                          render={({ field }) => <FormItem><FormControl><Input {...field} placeholder="Category" /></FormControl></FormItem>}
                        />
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteClick(field.id, index)} className="mt-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
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
