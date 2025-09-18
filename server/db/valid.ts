import { z } from "zod";
import { validateUsername, validatePassword } from "@/shared/utils";
// 登录只需要 username + password
export const loginSchema = z.object({
    username: z.string().min(2, "用户名至少 3 个字符").max(10, "用户名不能超过 10 个字符"),
    password: z.string().min(6, "密码至少 6 个字符").max(20, "密码不能超过20个字符"),
});

//注册
export const registerSchema = z.object({
    username: z
        .string()
        .min(2, "用户名至少 2 个字符")
        .max(20, "用户名不能超过 20 个字符")
        .refine(validateUsername, {
            message: "用户名只能包含中文、英文和数字，长度 2–20 位",
        }),

    password: z
        .string()
        .min(6, "密码至少 6 个字符")
        .max(20, "密码不能超过 20 个字符")
        .refine(validatePassword, {
            message: "密码必须包含至少 1 个数字和 1 个字母，只允许数字、字母和 @ 符号",
        }),
});
