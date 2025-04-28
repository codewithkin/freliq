"use client";

import { Bell, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import Notification from "./Notification";
import { queryClient } from "@/providers/QueryClientProvider";
import { toast } from "sonner";

function NotificationsSheet() {
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      return res.data;
    },
  });

  console.log("Notifications: ", notifications);

  const { mutate: markAllAsRead, isPending: markingAllAsRead } = useMutation({
    mutationKey: ["markAllAsRead"],
    mutationFn: async () => {
      // Make a request to the endpoint
      const res = await axios.patch(`/api/notifications`, { notifications });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      toast.success("All notifications have been read");
    },
    onError: () => {
      toast.error("Failed to mark notifications as read");
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm p-4">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold tracking-tight mb-4">
            Notifications
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {notifications.length > 0 ? (
              <div className="flex flex-col gap-2">
                {notifications.map((notif: any) => (
                  <Notification key={notif.id} notif={notif} />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground font-semibold text-lg">
                No notifications yet.
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks">
            {notifications.filter((notif: any) => {
              return notif.type === "task";
            }).length > 0 ? (
              <div className="flex flex-col gap-2">
                {notifications
                  .filter((notif: any) => {
                    return notif.type === "task";
                  })
                  .map((notif: any) => (
                    <Notification key={notif.id} notif={notif} />
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground font-semibold text-lg">
                No task notifications...yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects">
            {notifications.filter((notif: any) => {
              return notif.type === "project";
            }).length > 0 ? (
              <div className="flex flex-col gap-2">
                {notifications
                  .filter((notif: any) => {
                    return notif.type === "project";
                  })
                  .map((notif: any) => (
                    <Notification key={notif.id} notif={notif} />
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground font-semibold text-lg">
                Sorry, no project notifications here
              </div>
            )}
          </TabsContent>

          <TabsContent value="system">
            {notifications.filter((notif: any) => {
              return notif.type === "system";
            }).length > 0 ? (
              <div className="flex flex-col gap-2">
                {notifications
                  .filter((notif: any) => {
                    return notif.type === "system";
                  })
                  .length((notif: any) => (
                    <Notification key={notif.id} notif={notif} />
                  ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground font-semibold text-lg">
                No system notifications
              </div>
            )}
          </TabsContent>
        </Tabs>

        <SheetFooter>
          <SheetClose>Close</SheetClose>
          <Button
            onClick={() => {
              markAllAsRead();
            }}
            disabled={markingAllAsRead}
            variant="default"
            className="w-full mt-4"
          >
            {markingAllAsRead && <Loader2 className="animate-spin" />}
            {markingAllAsRead ? "Marking all as read" : "Mark all as read"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationsSheet;
