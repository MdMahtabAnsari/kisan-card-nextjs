import { ReactNode } from "react";
import { Header } from "@/components/header"


export default async function Layout({
    children,
}: {
    children: ReactNode;
}) {

    return (


       <>
            <Header />
            {children}
       </>

    );
}
