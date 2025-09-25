"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function SettingsAdminPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    }
  });

  async function onSubmit(values: z.infer<typeof passwordSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to change password");
      }
      
      toast({ title: "Success!", description: "Your password has been changed successfully." });
      form.reset();

    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your login password here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField 
                control={form.control} 
                name="currentPassword" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type={showCurrentPassword ? 'text' : 'password'} {...field} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                            >
                                {showCurrentPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField 
                control={form.control} 
                name="newPassword" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type={showNewPassword ? 'text' : 'password'} {...field} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                            >
                                {showNewPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <FormField 
                control={form.control} 
                name="confirmPassword" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                           <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </Button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
