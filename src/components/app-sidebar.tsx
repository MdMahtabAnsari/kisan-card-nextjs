"use client"
import * as React from "react"
import {
    BarChart3,
    CreditCard,
    History,
    LayoutDashboard,
    Users,
    ShoppingCart,
    Wallet,
    FileText,
    Settings,
    Home,
    BadgeIndianRupee
} from "lucide-react"
import Link from "next/link"



import {NavMain} from "@/components/nav-main"
// import {NavProjects} from "@/components/nav-projects"
// import {NavSecondary} from "@/components/nav-secondary"
import {NavUser} from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {User} from "@/lib/types/user"


type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user: User
}

export const adminNavMain = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Cards",
    url: "/admin/cards",
    icon: CreditCard,
    items: [
      {
        title: "All Cards",
        url: "/admin/cards",
      },
      {
        title: "Add Card",
        url: "/admin/cards/new",
      },
      {
        title: "QR Scan Lookup",
        url: "/admin/cards/scan",
      },
    ],
  },
  {
    title: "Users & Shops",
    url: "/admin/users",
    icon: Users,
    items: [
      {
        title: "All Users",
        url: "/admin/users",
      },
      {
        title: "Add User",
        url: "/admin/users/new",
      },
      {
        title: "All Shops",
        url: "/admin/shops",
      },
      {
        title: "Add Shop",
        url: "/admin/shops/new",
      },
    ],
  },
  {
    title: "Recharge",
    url: "/admin/recharge",
    icon: Wallet,
    items: [
      {
        title: "Recharge Cards",
        url: "/admin/recharge",
      },
      {
        title: "Recharge History",
        url: "/admin/recharge/history",
      },
    ],
  },
  {
    title: "Transactions",
    url: "/admin/transactions",
    icon: ShoppingCart,
    items: [
      {
        title: "All Transactions",
        url: "/admin/transactions",
      },
    ],
  },
  {
    title: "ERP Billing",
    url: "/admin/billing",
    icon: BarChart3,
    items: [
      {
        title: "Shop Performance",
        url: "/admin/billing",
      },
      {
        title: "Shop-wise Billing",
        url: "/admin/billing/shops",
      },
      {
        title: "Date-wise Reports",
        url: "/admin/billing/reports",
      },
      {
        title: "Card Activity",
        url: "/admin/billing/activity",
      },
    ],
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
    items: [
      {
        title: "All Reports",
        url: "/admin/reports",
      },
    ],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    items: [
      {
        title: "General Settings",
        url: "/admin/settings",
      },
    ],
  },
];

export const shopNavMain = [
  {
    title: "Dashboard",
    url: "/shop/dashboard",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/shop/dashboard",
      },
    ],
  },
  {
    title: "Customers",
    url: "/shop/customers",
    icon: Users,
    items: [
      {
        title: "Add Customer",
        url: "/shop/customers/new",
      },
      {
        title: "View Cards",
        url: "/shop/customers",
      },
      {
        title: "Search Cards",
        url: "/shop/customers/search",
      },
      {
        title: "Add Card",
        url: "/shop/customers/cards/new",
      },
    ],
  },
  {
    title: "Recharge",
    url: "/shop/recharge",
    icon: Wallet,
    items: [
      {
        title: "Recharge Cards",
        url: "/shop/recharge",
      },
      {
        title: "Recharge History",
        url: "/shop/recharge/history",
      },
    ],
  },
  {
    title: "Transactions",
    url: "/shop/transactions",
    icon: ShoppingCart,
    items: [
      {
        title: "New Transaction",
        url: "/shop/transactions/new",
      },
      {
        title: "All Transactions",
        url: "/shop/transactions",
      },
    ],
  },
  {
    title: "ERP Billing",
    url: "/shop/billing",
    icon: BarChart3,
    items: [
      {
        title: "Billing Dashboard",
        url: "/shop/billing",
      },
    ],
  },
  {
    title: "Settings",
    url: "/shop/settings",
    icon: Settings,
    items: [
      {
        title: "General Settings",
        url: "/shop/settings",
      },
    ],
  },
];

export const userNavMain = [
  {
    title: "My Dashboard",
    url: "/user/dashboard",
    icon: Home,
    isActive: true,
    items: [
      {
        title: "Overview",
        url: "/user/dashboard",
      },
    ],
  },
  {
    title: "Recharge",
    url: "/user/recharge",
    icon: Wallet,
    items: [
      {
        title: "Recharge Card",
        url: "/user/recharge",
      },
      {
        title: "Recharge History",
        url: "/user/recharge/history",
      },
    ],
  },
  {
    title: "Transactions",
    url: "/user/transactions",
    icon: History,
    items: [
      {
        title: "Transaction History",
        url: "/user/transactions",
      },
    ],
  },
  {
    title: "Settings",
    url: "/user/settings",
    icon: Settings,
    items: [
      {
        title: "General Settings",
        url: "/user/settings",
      },
    ],
  },
];

export function AppSidebar({user, ...props}: AppSidebarProps) {
    const navItems = user.role === "ADMIN" ? adminNavMain : user.role === "SHOP_MANAGER" ? shopNavMain : userNavMain;
    const panelName = user.role === "ADMIN" ? "Admin" : user.role === "SHOP_MANAGER" ? "Shop Manager" : "User";
    return (
        <Sidebar
            className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
            {...props}
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${user.role}/dashboard`}>
                                <div
                                    className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <BadgeIndianRupee className="size-4"/>
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">Kisan Card</span>
                                    <span className="text-xs text-muted-foreground">{panelName} Panel</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navItems}/>
                {/*<NavProjects projects={data.projects}/>*/}
                {/*<NavSecondary items={data.navSecondary} className="mt-auto"/>*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={{
                    name: user.name,
                    email: user.email,
                    avatar: user.image || ""
                }}/>
            </SidebarFooter>
        </Sidebar>
    )
}
