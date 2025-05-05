"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  Files,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  LayoutDashboard,
  FolderKanban,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { FaTasks } from "react-icons/fa";
import { Greeting } from "./Greeting";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import NotificationsSheet from "@/components/shared/NotificationsSheet";

// Sidebar items
const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    type: "primary" as "primary" | "secondary" | "tertiary",
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
    type: "primary",
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: FaTasks,
    type: "primary",
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
    type: "primary",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    type: "tertiary",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    type: "tertiary",
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Files,
    type: "tertiary",
  },
  {
    title: "Upgrade",
    url: "/upgrade",
    icon: Calendar,
    type: "secondary",
  },
];

function DashboardShell({
  children,
  hideHeader = false,
  className,
}: {
  children: ReactNode;
  hideHeader?: boolean;
  className?: string;
}) {
  // Get the user's data
  const { data: session, isPending } = authClient.useSession();

  console.log("User data: ", session);

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth"); // redirect to login page
        },
      },
    });
  };

  return (
    <section className={cn("min-h-screen flex bg-muted/40", className)}>
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex w-64 border-r bg-white shadow-sm">
        <SidebarProvider>
          <Sidebar>
            <SidebarContent className="py-8">
              <SidebarGroup>
                <SidebarGroupLabel className="text-2xl text-primary font-bold tracking-tight mb-4 pl-3 pb-3">
                  Freliq
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarGroupLabel>Primary</SidebarGroupLabel>
                        {sidebarItems.map(
                          (item) =>
                            item.type === "primary" && (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={item.url}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ),
                        )}
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarMenu>

                  <SidebarMenu className="mt-4">
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarGroupLabel>Secondary</SidebarGroupLabel>
                        {sidebarItems.map(
                          (item) =>
                            item.type === "secondary" && (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={item.url}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ),
                        )}
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarMenu>

                  <SidebarMenu className="mt-4">
                    <SidebarGroup>
                      <SidebarGroupContent>
                        <SidebarGroupLabel>Tertiary</SidebarGroupLabel>
                        {sidebarItems.map(
                          (item) =>
                            item.type === "tertiary" && (
                              <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={item.url}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ),
                        )}
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        {!hideHeader && (
          <header className="flex items-center justify-between bg-white md:py-4 md:px-8 p-4">
            {/* Mobile menu */}
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full p-4">
                  <SheetTitle className="text-2xl font-semibold tracking-tight mb-4 text-primary">
                    Freliq
                  </SheetTitle>
                  <div className="flex flex-col gap-2">
                    {sidebarItems.map(
                      (item) =>
                        item.type === "primary" && (
                          <Button key={item.title} variant="outline" asChild>
                            <Link
                              href={item.url}
                              className="flex items-center gap-2"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </Button>
                        ),
                    )}
                    <div className="my-4 border-t" />
                    {sidebarItems.map(
                      (item) =>
                        item.type === "secondary" && (
                          <Button key={item.title} variant="outline" asChild>
                            <Link
                              href={item.url}
                              className="flex items-center gap-2"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </Button>
                        ),
                    )}
                    <div className="my-4 border-t" />
                    {sidebarItems.map(
                      (item) =>
                        item.type === "tertiary" && (
                          <Button key={item.title} variant="outline" asChild>
                            <Link
                              href={item.url}
                              className="flex items-center gap-2"
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </Button>
                        ),
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Greeting />

            {/* Topbar right */}
            <div className="flex items-center gap-4 ml-auto">
              <Button asChild>
                <Link href="/project/new">
                  <Plus />
                  New project
                </Link>
              </Button>

              <NotificationsSheet />

              {isPending ? (
                <Skeleton className="bg-slate-300 h-8 w-8 rounded-full" />
              ) : (
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className="bg-slate-300"
                    src={session?.user?.image || ""}
                  />
                  <AvatarFallback className="bg-slate-300">
                    <p>{session?.user?.email.charAt(0).toUpperCase()}</p>
                  </AvatarFallback>
                </Avatar>
              )}

              <Button
                onClick={handleSignOut}
                variant="ghost"
                size="icon"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>
        )}

        {/* Page content */}
        <section
          className={cn("flex-1 p-2 sm:p-3 md:p-6", !hideHeader && "md:mt-16")}
        >
          {children}
        </section>
      </main>
    </section>
  );
}

export default DashboardShell;
