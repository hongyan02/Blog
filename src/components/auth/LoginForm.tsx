"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateUsername, validatePassword } from "@/shared/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { encryptPassword } from "@/shared/crypto";

type Inputs = {
    username: string;
    password: string;
};

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>();

    const router = useRouter();
    const { refreshUser } = useAuth();
    const [serverError, setServerError] = useState("");

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setServerError("");

        try {
            // 加密密码后再发送
            const encryptedPassword = encryptPassword(data.password);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    password: encryptedPassword,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setServerError(result.error || "登录失败");
                return;
            }

            console.log("登录成功", result);

            // 登录成功后，刷新用户信息（从cookie中读取）
            await refreshUser();

            // 登录成功后，跳转到游戏页面
            router.push("/games");
        } catch (err) {
            console.error(err);
            setServerError("网络错误，请稍后再试");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-3 w-full">
            <div className="flex flex-col space-y-2">
                <label htmlFor="username" className="text-lg font-medium">
                    用户名:
                </label>
                <input
                    className="border-2 rounded-md border-black px-4 py-3 text-lg"
                    id="username"
                    type="text"
                    {...register("username", {
                        required: "用户名不能为空",
                        minLength: { value: 2, message: "用户名不能少于2个字符" },
                        maxLength: { value: 10, message: "用户名不能超过10个字符" },
                        validate: (value) => validateUsername(value) || "用户名格式不正确",
                    })}
                />
                {errors.username && (
                    <span className="text-red-500 text-sm">{errors.username.message}</span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="password" className="text-lg font-medium">
                    密码:
                </label>
                <input
                    className="border-2 rounded-md border-black px-4 py-3 text-lg"
                    id="password"
                    type="password"
                    {...register("password", {
                        required: "密码不能为空",
                        minLength: { value: 6, message: "密码不能少于6个字符" },
                        maxLength: { value: 20, message: "密码不能超过20个字符" },
                        validate: (value) => validatePassword(value) || "密码格式不正确",
                    })}
                />
                {errors.password && (
                    <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <button
                    type="submit"
                    className="bg-black hover:bg-gray-600 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
                >
                    登录
                </button>
                {serverError && <span className="text-red-500 text-sm">{serverError}</span>}
            </div>
        </form>
    );
}
