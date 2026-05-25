import Link from "next/link"

import { CreditCard } from "lucide-react"
import { ModeToggle } from "@/components/toggle/mode.toggle"
import { Button } from "@/components/ui/button"


export async function Header() {

  return (

     <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-muted">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-sm font-semibold leading-none text-foreground">
                Kisna Reward Card
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Loyalty & Reward Platform
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            <Link href="/auth/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>
  )
}
