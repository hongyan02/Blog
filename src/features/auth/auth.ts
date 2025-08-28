import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/features/auth/jwt";
import { redirect } from "next/navigation";

export function requireAuth(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    // if (!token) throw new Error("未登录");
    if (!token) return null;

    try {
        const payload = verifyToken<{ userId: string; username: string; role: number }>(token);
        return payload ?? null; // 如果 verifyToken 返回 undefined / null
    } catch {
        // token 被篡改、过期、签名错误
        return null;
    }
}

export async function requirePageAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        console.log("未登录");
        redirect("/games/login"); // 未登录 → 立即 302
    }
    return payload; // 已登录 → 把用户信息返回给页面使用
}
