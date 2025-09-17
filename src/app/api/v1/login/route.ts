import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@server/db/db";
import { users } from "@server/db/schema";
import { eq } from "drizzle-orm";
import { createSession } from "@/features/auth/session";
import { decryptPassword } from "@/shared/crypto";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    //用户信息
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 400 });

    // 解密前端传来的加密密码
    let decryptedPassword: string;
    try {
        decryptedPassword = decryptPassword(password);
    } catch {
        return NextResponse.json({ error: "密码格式错误" }, { status: 400 });
    }

    const valid = await bcrypt.compare(decryptedPassword, user.password);
    if (!valid) return NextResponse.json({ error: "密码错误" }, { status: 400 });

    if (user.status !== 0) return NextResponse.json({ error: "账号不可用" }, { status: 403 });

    const token = await createSession(user.id);

    const res = NextResponse.json({ message: "登录成功" });

    //设置session cookie
    res.cookies.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    const userInfo = {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        role: user.role,
    };
    //设置用户信息cookie
    res.cookies.set("user_info", JSON.stringify(userInfo), {
        httpOnly: false, // 允许前端读取
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    return res;
}
