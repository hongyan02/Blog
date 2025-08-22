"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGunCodeMutation } from "@/queries/df/guncode";
import { useState } from "react";

export type AddGunCodeForm = {
    weaponName: string;
    gunCode: string;
    description: string;
    isPublic: boolean;
};

export default function AddCodeForm({ onClose }: { onClose?: () => void }) {
    const { register, handleSubmit, reset } = useForm<AddGunCodeForm>();
    const [serverError, setServerError] = useState("");

    const { mutate, isPending } = useGunCodeMutation();

    const onSubmit: SubmitHandler<AddGunCodeForm> = (values) => {
        setServerError("");
        mutate(values, {
            onSuccess: () => {
                reset();
                onClose?.();
            },
            onError: (err) => setServerError(err.message),
        });
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-3 w-full"
        >
            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">枪械名称:</label>
                <input
                    className="border-2 border-black rounded-md px-4 py-3 text-lg"
                    {...register("weaponName", { required: true })}
                    placeholder="例：M4A1"
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">改枪码:</label>
                <input
                    className="border-2 border-black rounded-md px-4 py-3 text-lg"
                    {...register("gunCode", { required: true })}
                    placeholder="例：ABC123XYZ"
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">描述:</label>
                <textarea
                    className="border-2 border-black rounded-md px-4 py-3 text-lg resize-none"
                    rows={3}
                    {...register("description", { required: true })}
                    placeholder="简短描述一下配置特色"
                />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    className="w-5 h-5"
                    {...register("isPublic")}
                />
                <span className="text-lg font-medium">公开到首页</span>
            </label>

            <div className="flex flex-col space-y-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black hover:bg-gray-600 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
                >
                    {isPending ? "添加中…" : "添加"}
                </button>
                {serverError && <span className="text-red-500 text-sm">{serverError}</span>}
            </div>
        </form>
    );
}
