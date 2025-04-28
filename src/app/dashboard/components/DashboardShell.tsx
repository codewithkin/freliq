"use client";

import { ReactNode } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
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

// Sidebar items
const sidebarItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: FaTasks,
  },
  {
    title: "Files",
    url: "/files",
    icon: Files,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

function DashboardShell({ children }: { children: ReactNode }) {
  // Get the user's data
  const { data: session, isPending } = authClient.useSession();

  console.log("User data: ", session);

  return (
    <section className="min-h-screen flex bg-muted/40">
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
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link href={item.url}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
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
                  {sidebarItems.map((item) => (
                    <Button key={item.title} variant="outline" asChild>
                      <Link href={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Greeting />

          {/* Topbar right */}
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <Avatar className="h-8 w-8">
              <AvatarImage
                className="bg-slate-300"
                src={session?.user?.image || ""}
              />
              <AvatarFallback className="bg-slate-300">
                <p>{session?.user?.email.charAt(0).toUpperCase()}</p>
              </AvatarFallback>
            </Avatar>

            <Button variant="ghost" size="icon" title="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <section className="flex-1 p-2 sm:p-3 md:p-6">{children}</section>
      </main>
    </section>
  );
}

export default DashboardShell;
