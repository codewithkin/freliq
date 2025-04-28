"use client";

import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge } from "../ui/badge";
import { formatDistanceToNow } from "date-fns";
import Notification from "./Notification";

function NotificationsSheet() {
  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get("/api/notifications");
      return res.data;
    },
  });

  console.log("Notifications: ", notifications);

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

      </SheetContent>
    </Sheet>
  );
}

export default NotificationsSheet;
