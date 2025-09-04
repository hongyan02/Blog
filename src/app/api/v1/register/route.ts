import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/features/db/db";
import { users, invites } from "@/features/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { validateUsername, validatePassword } from "@/shared/utils";
import { createSession } from "@/features/auth/session";
import { decryptPassword } from "@/shared/crypto";

export async function POST(req: NextRequest) {
    const { username, password, inviteCode } = await req.json();

    // 解密前端传来的加密密码
    let decryptedPassword: string;
    try {
        decryptedPassword = decryptPassword(password);
    } catch (error) {
        return NextResponse.json({ error: "密码格式错误" }, { status: 400 });
    }

    /* 1. 用户名校验 */
    if (!validateUsername(username)) {
        return NextResponse.json(
            { error: "用户名只能包含中文、英文字母或数字，长度为 2-20 位" },
            { status: 400 }
        );
    }

    /* 2. 密码校验 */
    if (!validatePassword(decryptedPassword)) {
        return NextResponse.json(
            { error: "密码必须同时包含数字、字母符号，特殊符号只允许@，且长度不少于 6 位" },
            { status: 400 }
        );
    }

    // 1. 检查邀请码
    const [invite] = await db
        .select()
        .from(invites)
        .where(
            and(
                eq(invites.code, inviteCode), // 邀请码匹配
                eq(invites.used, false), // 未被使用
                gt(invites.expiresAt, new Date()) // 未过期
            )
        );
    if (!invite) return NextResponse.json({ error: "邀请码无效或已过期" }, { status: 400 });

    // 2. 创建用户
    const hashed = await bcrypt.hash(decryptedPassword, 10);
    const [user] = await db
        .insert(users)
        .values({
            username,
            password: hashed,
            inviteCode,
        })
        .returning();

    // 3. 标记邀请码已使用
    await db
        .update(invites)
        .set({ used: true, usedBy: user.id })
        .where(eq(invites.code, inviteCode));

    // 5. 生成 session
    const token = await createSession(user.id);

    const res = NextResponse.json({ message: "登录成功" });
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
