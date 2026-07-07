import {UserStats} from "@/components/stats/admin/user/user.stats";
import { UserRegistrationChart } from "@/components/chart/admin/user-registration.chart";
import { UserTable } from "@/components/table/admin/user/user";

export default function Page(){
    return (
        <div className="w-full h-full space-y-4">
            <UserStats/>
            <UserRegistrationChart/>
            <UserTable/>
        </div>
    )
}