import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, twoFactorClient, usernameClient, magicLinkClient, adminClient, lastLoginMethodClient, multiSessionClient, emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";
import { auth } from "@/lib/auth/auth";
import { admin, user, shopManager, warehouseManager, ac } from "@/lib/auth/permissions/admin.permission";
import { UserRole } from "@/generated/prisma/browser";

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        multiSessionClient(),
        inferAdditionalFields<typeof auth>(),
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = "/auth/two-factor";
            }
        }),
        usernameClient(),
        magicLinkClient(),
        adminClient({
            defaultRole: UserRole.USER,
            ac,
            roles: {
                [UserRole.ADMIN]: admin,
                [UserRole.USER]: user,
                [UserRole.SHOP_MANAGER]: shopManager,
                [UserRole.WAREHOUSE_MANAGER]: warehouseManager
            }

        }),
        lastLoginMethodClient(),
        phoneNumberClient(),
    ],
});