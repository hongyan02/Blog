"use client";

import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/tiptap";

type Inputs = {
    title: string;
    eventDate: string;
    content: string; // 存 JSON 格式的字符串
    bvid?: string;
};

export default function TimelineForm() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<Inputs>();

    const [serverError, setServerError] = useState("");
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setServerError("");

        try {
            const res = await fetch("/api/v1/timeline", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    // content 存储为 JSON 格式
                    content: data.content,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setServerError(result.error || "提交失败");
                return;
            }

            console.log("提交成功", result);
            alert("时间线已保存 ✅");

            // 跳转到时间轴页面
            router.push("/timeline");
        } catch (err) {
            console.error(err);
            setServerError("网络错误，请稍后再试");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-3 w-full">
            {/* 标题 */}
            <div className="flex flex-col space-y-2">
                <label htmlFor="title" className="text-lg font-medium">
                    标题:
                </label>
                <input
                    className="border-2 rounded-md border-black px-4 py-3 text-lg"
                    id="title"
                    type="text"
                    {...register("title", { required: "标题不能为空" })}
                />
                {errors.title && (
                    <span className="text-red-500 text-sm">{errors.title.message}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                {/* 日期 */}
                <div className="flex flex-col space-y-2 flex-1">
                    <label htmlFor="eventDate" className="text-lg font-medium">
                        日期 (yyyy-mm-dd):
                    </label>
                    <input
                        className="border-2 rounded-md border-black px-4 py-3 text-lg"
                        id="eventDate"
                        type="date"
                        {...register("eventDate", { required: "日期不能为空" })}
                    />
                    {errors.eventDate && (
                        <span className="text-red-500 text-sm">{errors.eventDate.message}</span>
                    )}
                </div>

                {/* bvid */}
                <div className="flex flex-col space-y-2 flex-1">
                    <label htmlFor="bvid" className="text-lg font-medium">
                        BVID (可选):
                    </label>
                    <input
                        className="border-2 rounded-md border-black px-4 py-3 text-lg"
                        id="bvid"
                        type="text"
                        {...register("bvid")}
                    />
                </div>
            </div>
            {/* 内容（MarkdownEditor） */}
            <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium">内容:</label>
                <Controller
                    name="content"
                    control={control}
                    defaultValue=""
                    rules={{ required: "内容不能为空" }}
                    render={({ field }) => (
                        <MarkdownEditor
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="开始写点什么..."
                        />
                    )}
                />
                {errors.content && (
                    <span className="text-red-500 text-sm">{errors.content.message}</span>
                )}
            </div>

            {/* 提交按钮 */}
            <div className="flex flex-col space-y-2">
                <button
                    type="submit"
                    className="bg-black hover:bg-gray-600 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
                >
                    保存
                </button>
                {serverError && <span className="text-red-500 text-sm">{serverError}</span>}
            </div>
        </form>
    );
}
