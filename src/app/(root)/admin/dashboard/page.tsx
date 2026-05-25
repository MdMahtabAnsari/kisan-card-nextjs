import { DashboardStats } from "@/components/stats/admin/dashboard.stats";
import { DashboardAction } from "@/components/action/admin/dashboard.action";
import { UserRegistrationChart } from "@/components/chart/admin/user-registration.chart";
import { UserTable } from "@/components/table/admin/user/user";
export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <DashboardStats />
            <DashboardAction />
            <UserRegistrationChart />
            <UserTable />
        </div>
    )
}