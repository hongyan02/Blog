"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateInviteCode } from "@/queries/admin/invitecode";

type Inputs = {
    count: number;
};

export default function CreateInviteForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Inputs>();

    const { mutate, isPending, data } = useCreateInviteCode();

    const onSubmit: SubmitHandler<Inputs> = ({ count }) => {
        mutate({ count }, { onSuccess: () => reset() });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md mx-auto p-6 bg-white border-2 border-black/30 rounded-lg shadow-md space-y-6"
        >
            <h2 className="text-2xl font-bold text-center text-black">创建邀请码</h2>

            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium text-black">数量</label>
                <input
                    type="number"
                    {...register("count", {
                        required: "数量不能为空",
                        min: { value: 1, message: "至少生成 1 个" },
                        max: { value: 50, message: "最多生成 50 个" },
                    })}
                    className="border-2 border-black/30 rounded-md px-4 py-3 text-lg"
                />
                {errors.count && (
                    <span className="text-red-500 text-sm">{errors.count.message}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
            >
                {isPending ? "生成中…" : "生成"}
            </button>

            {data?.codes?.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-bold text-black">已生成</h3>
                    <ul className="text-sm text-black border-t border-black/20 pt-2">
                        {data.codes.map((code: string) => (
                            <li key={code} className="py-1 font-mono">
                                {code}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
}
