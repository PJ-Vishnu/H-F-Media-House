
"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry } from "@/modules/inquiries/inquiries.schema";
import { Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function InquiriesAdminPage() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      const data: Inquiry[] = await res.json();
      setInquiries(data);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch inquiries" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/inquiries?id=${itemToDelete}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(inquiry => inquiry.id !== itemToDelete));
      toast({ title: "Inquiry deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete inquiry" });
    } finally {
      setDialogOpen(false);
    }
  };

  if (isLoading) {
     return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Contact Inquiries</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Received Messages</CardTitle>
          <CardDescription>Here are the messages submitted through the contact form.</CardDescription>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground">No inquiries found.</p>
          ) : (
             <Accordion type="single" collapsible className="w-full">
                {inquiries.map((inquiry) => (
                  <AccordionItem value={inquiry.id} key={inquiry.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full pr-4">
                        <div className="flex-1 text-left">
                            <span className="font-semibold">{inquiry.firstName} {inquiry.lastName}</span>
                            <span className="text-muted-foreground ml-2 text-sm">({inquiry.email})</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(inquiry.createdAt), "PPP")}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="mb-4 whitespace-pre-wrap">{inquiry.message}</p>
                        <p className="text-sm text-muted-foreground mb-4">Phone: {inquiry.phone || 'Not provided'}</p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(inquiry.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
       <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This will permanently delete this inquiry. This action cannot be undone."
        confirmText="Delete"
      />
    </div>
  );
}
