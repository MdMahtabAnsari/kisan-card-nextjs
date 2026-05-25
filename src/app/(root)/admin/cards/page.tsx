import { CardStats } from "@/components/stats/admin/card/card.stats";
import { CardTypeChart } from "@/components/chart/admin/card/card-type.chart";
import {CardTable} from "@/components/table/admin/card/card";
export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <CardStats />
            <CardTypeChart />
            <CardTable />
        </div>
    )
}