"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { validateUsername, validatePassword } from "@/shared/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/components/AuthContext";
import { encryptPassword } from "@/shared/crypto";

type Inputs = {
    username: string;
    password: string;
    confirmPassword: string;
    inviteCode: string;
};

export default function RegisterForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>();

    const router = useRouter();
    const { login } = useAuth();
    const [serverError, setServerError] = useState("");

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        setServerError("");

        if (data.password !== data.confirmPassword) {
            setServerError("两次输入的密码不一致");
            return;
        }

        try {
            // 加密密码后再发送
            const encryptedPassword = encryptPassword(data.password);

            const res = await fetch("/api/v1/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    password: encryptedPassword,
                    inviteCode: data.inviteCode,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setServerError(result.error || "注册失败");
                return;
            }

            console.log("注册成功", result);
            alert(`注册成功，欢迎 ${result.user.username}`);

            // 更新AuthContext状态
            login(result.user);

            // 注册成功后，跳转到游戏页面
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
                <label htmlFor="confirmPassword" className="text-lg font-medium">
                    确认密码:
                </label>
                <input
                    className="border-2 rounded-md border-black px-4 py-3 text-lg"
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword", {
                        required: "确认密码不能为空",
                        minLength: { value: 6, message: "确认密码不能少于6个字符" },
                        maxLength: { value: 20, message: "确认密码不能超过20个字符" },
                        validate: (value) => {
                            if (value !== watch("password")) {
                                return "确认密码与密码不一致";
                            }
                            return validatePassword(value) || "确认密码格式不正确";
                        },
                    })}
                />
                {errors.confirmPassword && (
                    <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="inviteCode" className="text-lg font-medium">
                    邀请码:
                </label>
                <input
                    className="border-2 rounded-md border-black px-4 py-3 text-lg"
                    id="inviteCode"
                    type="text"
                    {...register("inviteCode", {
                        required: "邀请码不能为空",
                    })}
                />
                {errors.inviteCode && (
                    <span className="text-red-500 text-sm">{errors.inviteCode.message}</span>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <button
                    type="submit"
                    className="bg-black hover:bg-gray-600 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
                >
                    注册
                </button>
                {serverError && <span className="text-red-500 text-sm">{serverError}</span>}
            </div>
        </form>
    );
}
