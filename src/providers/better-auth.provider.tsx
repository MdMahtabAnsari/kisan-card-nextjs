"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "@/lib//auth/auth-client"
import { getQueryClient } from "@/trpc/query-client"
import { AuthProvider } from "@/components/auth/auth-provider"
import { multiSessionPlugin } from "@/lib/auth/plugins/multi-session-plugin"
import { themePlugin } from "@/lib/auth/plugins/theme-plugin"
import { useTheme } from "next-themes"
import { magicLinkPlugin } from "@/lib/auth/plugins/magic-link-plugin"
import { usernamePlugin } from "@/lib/auth/plugins/username-plugin"
import { aadhaarNumber } from "@/lib/schema/common/common"

export function BetterAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider
        authClient={authClient}
        redirectTo="/user/dashboard"
        navigate={({ to, replace }) =>
          replace ? router.replace(to) : router.push(to)
        }
        plugins={[multiSessionPlugin(), themePlugin({ useTheme }), magicLinkPlugin(), usernamePlugin()]}

        additionalFields={[
          {
            name: "aadhaarNumber",
            label: "Aadhaar Number",
            type: "string",
            inputType: "input",
            placeholder: "Enter your Aadhaar number",
            required: false,
            signUp: true,
            validate: (value) => {
              if (!aadhaarNumber.safeParse(value).success) {
                throw new Error("Aadhaar number must be a 12-digit numeric string")
              }

            }
          }
        ]}

        emailAndPassword={{
          confirmPassword: true,
          enabled: true,
          forgotPassword: true,
          rememberMe: true,
          requireEmailVerification: true,
        }}

        viewPaths={{
          auth: {
            signUp: "",
          }
        }}

        Link={Link}
      >
        {children}

      </AuthProvider>
    </QueryClientProvider>
  )
}