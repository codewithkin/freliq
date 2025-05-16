"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  emailNotifications: z.boolean(),
  projectUpdates: z.boolean(),
  taskReminders: z.boolean(),
  showProfile: z.boolean(),
  showEmail: z.boolean(),
});

export default function SettingsPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await axios.get("/api/user/settings");
      return res.data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailNotifications: true,
      projectUpdates: true,
      taskReminders: true,
      showProfile: true,
      showEmail: false,
    },
    values: settings,
  });

  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const res = await axios.put("/api/user/settings", values);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Settings updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update settings");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updateSettings)}
          className="space-y-8"
        >
          {/* Notification Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notification Preferences</h2>

            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive important account notifications via email
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Other settings fields... */}
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Privacy Settings</h2>

            <FormField
              control={form.control}
              name="showProfile"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <FormLabel>Public Profile Visibility</FormLabel>
                    <FormDescription>
                      Control who can see your profile information
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Other privacy fields... */}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
