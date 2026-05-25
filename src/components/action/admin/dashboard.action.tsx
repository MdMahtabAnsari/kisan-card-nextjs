import { CreditCard } from "lucide-react";
import { ActionCard } from "@/components/card/action.card";

export function DashboardAction() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
                title="Manage Cards"
                description="View and manage all cards in the system."
                icon={<CreditCard className="h-8 w-8" />}
            />
            <ActionCard
                title="Manage Cards"
                description="View and manage all cards in the system."
                icon={<CreditCard className="h-8 w-8" />}
            />
            <ActionCard
                title="Manage Cards"
                description="View and manage all cards in the system."
                icon={<CreditCard className="h-8 w-8" />}
            />
            <ActionCard
                title="Manage Cards"
                description="View and manage all cards in the system."
                icon={<CreditCard className="h-8 w-8" />}
            />
        </div>
    );
}