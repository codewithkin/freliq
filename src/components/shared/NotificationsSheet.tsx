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
                  <div
                    key={notif.id}
                    className={`border p-3 rounded-md text-muted-foreground ${notif.read ? "bg-white" : "bg-slate-100"}`}
                  >
                    <h2 className="font-semibold text-lg capitalize">
                      {notif.title}
                    </h2>
                    <article className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs text-muted-foreground bg-slate-300 rounded-full"
                      >
                        {formatDistanceToNow(new Date(notif.createdAt))} ago
                      </Badge>
                      <Badge
                        variant={notif.read ? "outline" : "default"}
                        className="mb-2 text-xs rounded-full"
                      >
                        {notif.read ? <p>Read</p> : <p>Unread</p>}
                      </Badge>
                    </article>
                    <p className="text-sm">{notif.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                No notifications yet.
              </div>
            )}
          </TabsContent>

          {/* You can later filter for tasks, projects, system based on notif.type */}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationsSheet;
