import {RechargeDetail} from "@/components/recharge/admin/recharge-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }){
    const { id } = await params;
    return(
        <div className="w-full h-fit">
            <RechargeDetail id={id} />
        </div>
    )
}