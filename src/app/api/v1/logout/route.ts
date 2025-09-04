import { NextResponse } from "next/server";

export async function POST() {
    const res = NextResponse.json({ message: "退出登录成功" });

    // 清除 session cookie
    res.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // 立即失效
    });

    res.cookies.set("user_info", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // 立即失效
    });

    return res;
}
