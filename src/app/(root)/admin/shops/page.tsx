import {ShopStats} from "@/components/stats/admin/shop/shop.stats";
import {ShopRegistrationChart} from "@/components/chart/admin/shop/shop-registration.chart";

export default function Page() {
    return (
        <div className="w-full h-full space-y-4">
            <ShopStats />
            <ShopRegistrationChart />
        </div>
    )
}