import CopyIcon from "@/shared/icons/Copy";
import CrossIcon from "@/shared/icons/Cross";
import { BeanHead } from "beanheads";
import { BeanHeadProps } from "../../avatar";
import { useDeleteGunCodeMutation } from "@/queries/df/guncode";

// 定义API返回的数据类型
export type GunCodeData = {
    id: string;
    weaponName: string;
    gunCode: string;
    description: string;
    isPublic: boolean;
    createdAt: string;
    username: string;
    avatar: BeanHeadProps;
};

export function GunCodeCard({ data }: { data: GunCodeData }) {
    const { mutate: deleteCode } = useDeleteGunCodeMutation();
    return (
        <div className="rounded-md border-2 border-gray-400/50 bg-white/30 backdrop-blur-md p-4 h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">{data.weaponName}</h2>
                <button
                    className=""
                    onClick={() => deleteCode(data.id)}
                >
                    <CrossIcon className="w-4 h-4 transition-transform transform hover:scale-125 hover:text-red-500" />
                </button>
            </div>

            <p className="text-sm text-gray-500">{data.description}</p>
            <p className="text-sm truncate">{data.gunCode}</p>
            <div className="flex items-center justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 shrink-0">
                        <BeanHead {...data.avatar} />
                    </div>
                    <span className="text-sm truncate">{data.username}</span>
                </div>
                <button
                    className="p-1 rounded-md transition-transform transform hover:scale-125 hover:text-blue-500"
                    onClick={() => {
                        navigator.clipboard.writeText(data.gunCode);
                    }}
                >
                    <CopyIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
