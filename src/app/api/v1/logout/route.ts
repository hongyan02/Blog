import { NextResponse } from "next/server";

export async function POST() {
    // 清除token cookie
    return NextResponse.json(
        { message: "退出登录成功" },
        {
            status: 200,
            headers: {
                "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Strict",
            },
        }
    );
}
