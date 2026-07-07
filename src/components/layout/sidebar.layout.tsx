import { User } from "@/lib/types/user";
import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"


interface SidebarLayoutProps {
    user: User,
    children: ReactNode
}

export function SidebarLayout({ user, children }: SidebarLayoutProps) {
    return (
        <div className="h-screen overflow-hidden [--header-height:calc(--spacing(14))]">
            <SidebarProvider className="flex h-full flex-col">

                {/* Fixed Header */}
                <div className="sticky top-0 z-50 shrink-0">
                    <SiteHeader />
                </div>

                {/* Remaining Layout */}
                <div className="flex flex-1 overflow-hidden">

                    <AppSidebar user={user} />

                    <SidebarInset className="min-w-0 overflow-hidden">

                        {/* ONLY CONTENT SCROLLS */}
                        <div className="h-full overflow-y-auto overflow-x-hidden p-4">

                            <div className="min-w-0 bg-muted/50 p-4">
                                {children}
                            </div>

                        </div>

                    </SidebarInset>

                </div>
            </SidebarProvider>
        </div>
    )
}
