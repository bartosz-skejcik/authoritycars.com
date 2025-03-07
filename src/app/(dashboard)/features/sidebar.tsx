"use client";

import {
  ChevronRightIcon,
  FileClock,
  Home,
  Inbox,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import ProfileDropdown from "@/app/(dashboard)/features/profile-dropdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Submissions",
    url: "/dashboard/submissions",
    icon: Inbox,
  },
  {
    title: "Activity",
    url: "/dashboard/activity",
    icon: FileClock,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="w-full">
            <ProfileDropdown />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppHeader() {
  const path = usePathname();
  const breadcrumbs = path.split("/").filter((part) => part !== "");

  return (
    <header className="bg-sidebar border-sidebar-border flex w-full items-center justify-start gap-2 border-b p-2">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((part, index, parts) => (
            <BreadcrumbItem key={index}>
              {index === parts.length - 1 ? (
                <BreadcrumbPage className="text-md capitalize">
                  {part}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={`/${parts.slice(0, index + 1).join("/")}`}
                  className="text-md pr-1 capitalize"
                >
                  {part}
                </BreadcrumbLink>
              )}
              {index != parts.length - 1 && (
                <ChevronRightIcon size={16} className="pl-0.5" />
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
