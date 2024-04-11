import { BookOpenCheck, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    title: "Chats",
    icon: MessageSquare,
    href: "/dashboard/chats",
    color: "text-orange-500",
    // isChidren: true,
    // children: [
    //   {
    //     title: "All Users",
    //     icon: BookOpenCheck,
    //     color: "text-red-500",
    //     href: "/dashboard/user/users",
    //   },
    // ],
  },
  {
    title: "Admin Settings",
    icon: Settings,
    href: "/dashboard/admin/settings",
    color: "text-sky-500",
  },
];
