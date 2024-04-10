import { BookOpenCheck, LayoutDashboard } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    title: "Users",
    icon: BookOpenCheck,
    href: "/dashboard/user",
    color: "text-orange-500",
    isChidren: true,
    children: [
      {
        title: "All Users",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/dashboard/user/users",
      },
    ],
  },
  {
    title: "Admin Settings",
    icon: LayoutDashboard,
    href: "/dashboard/admin/settings",
    color: "text-sky-500",
  },
];
