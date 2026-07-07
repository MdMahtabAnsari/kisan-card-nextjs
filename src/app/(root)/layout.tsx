import { ReactNode } from "react";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarLayout } from "@/components/layout/sidebar.layout";
import { User } from "@/lib/types/user";


export default async function Layout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.session || !session?.user) {
        return redirect("/auth/sign-in");
    }
    const user = session.user;
    const userWithRole: User = {
        ...user,
        role:user.role as User["role"]
    };
    return (
        <SidebarLayout user={userWithRole}>
            <div className="w-full h-full flex justify-center items">
            {children}
            </div>
        </SidebarLayout>
    );
}
