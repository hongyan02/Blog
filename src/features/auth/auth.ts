import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/features/auth/jwt";
import { redirect } from "next/navigation";

export function requireAuth(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) throw new Error("未登录");

    const payload = verifyToken<{ userId: string; username: string; role: number }>(token);
    if (!payload) throw new Error("token 无效或已过期");

    return payload; // { userId, username, role }
}

export async function requirePageAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        console.log("未登录");
        redirect("/games"); // 未登录 → 立即 302
    }
    return payload; // 已登录 → 把用户信息返回给页面使用
}
