"use client";

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import Link from "next/link";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Separator } from "@/components/ui/separator";

export function AsideBar() {
    return (
        <Sidebar
            collapsible="icon"
            className="mt-4 min-w-fit w-[200px] h-[calc(100vh-32px)] left-10 rounded-xl border-none"
        >
            <SidebarContent className="bg-transparent px-5 flex flex-col items-end gap-8">
                <div className="flex items-center justify-end h-12 mr-2">
                    <SidebarTrigger />
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel className="hidden">
                        Navigate
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {asideLinks.slice(0, 4).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2"
                                >
                                    <CustomSideBarMenuItem item={item} />

                                    <Separator
                                        className={
                                            index === 3 ? "hidden" : "flex"
                                        }
                                    />
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="w-full flex justify-center">
                    <Separator className="w-6" />
                </div>

                <SidebarGroup>
                    <SidebarGroupLabel className="hidden">
                        Other Links
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-2">
                            {asideLinks.slice(4, 6).map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2"
                                >
                                    <CustomSideBarMenuItem item={item} />

                                    <Separator
                                        className={
                                            index === 1 ? "hidden" : "flex"
                                        }
                                    />
                                </div>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

function CustomSideBarMenuItem({ item }: { item: AsideLink }) {
    const path = usePathname();
    const isActive = path === item.url;

    return (
        <SidebarMenuItem key={item.title} className="flex flex-col gap-2">
            <SidebarMenuButton
                asChild
                className={clsx("gap-4 py-1 text-sm font-medium pl-0.5", {
                    "stroke-sidebar-foreground text-sidebar-foreground":
                        isActive,
                    "stroke-placeholder text-placeholder": !isActive,
                })}
            >
                <Link href={item.url}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

const asideLinks: AsideLink[] = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Markets",
        url: "/markets",
        icon: Inbox,
    },
    {
        title: "My Bets",
        url: "/my-bets",
        icon: Calendar,
    },
    {
        title: "Create",
        url: "/create",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/Settings",
        icon: Settings,
    },
    {
        title: "Docs",
        url: "/docs",
        icon: Settings,
    },
];

type AsideLink {
    title: string;
    url: string;
    icon: any;
}
