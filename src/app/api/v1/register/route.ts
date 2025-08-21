import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/shared/db";
import { users, invites } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { signToken } from "@/features/auth/jwt";
import { validateUsername, validatePassword } from "@/shared/utils";

export async function POST(req: NextRequest) {
    const { username, password, inviteCode } = await req.json();

    /* 1. 用户名校验 */
    if (!validateUsername(username)) {
        return NextResponse.json(
            { error: "用户名只能包含中文、英文字母或数字，长度为 2-20 位" },
            { status: 400 }
        );
    }

    /* 2. 密码校验 */
    if (!validatePassword(password)) {
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
    const hashed = await bcrypt.hash(password, 10);
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

    // 5. 生成 JWT
    const token = signToken({ userId: user.id, username: user.username, role: user.role });

    return NextResponse.json(
        { user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar } },
        {
            status: 200,
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800`, // 7天
            },
        }
    );
}
