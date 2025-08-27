import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";
import { invites, users } from "@/db/schema";
import { alias } from "drizzle-orm/pg-core";
import { and, eq, isNull, desc } from "drizzle-orm";
import { requireAuth } from "@/features/auth/auth";
import { toZonedTime } from "date-fns-tz";

// Base58 字符集（排除 0 O I l）
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateCode(length = 16) {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += BASE58.charAt(Math.floor(Math.random() * BASE58.length));
    }
    return code;
}
const usedUser = alias(users, "usedUser");
export async function POST(req: NextRequest) {
    try {
        // ✅ 检查用户身份
        const user = requireAuth(req);
        if (!user) {
            return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });
        }
        if (user.role !== 1) {
            return NextResponse.json({ error: "无权限" }, { status: 403 });
        }

        const creator = user;
        const creatorUsername = user.username;

        // ✅ 解析请求体
        const body = await req.json().catch(() => ({}));
        const count = Math.min(Math.max(Number(body.count) || 1, 1), 50);
        // 最少 1 个，最多 50 个

        const expiresAt = new Date(); // 当前 UTC 时间
        expiresAt.setDate(expiresAt.getDate() + 3); // 加上3天
        const expiresAtBJ = toZonedTime(expiresAt, "Asia/Shanghai");

        const codes = Array.from({ length: count }, () => generateCode());

        // ✅ 批量插入
        await db.insert(invites).values(
            codes.map((code) => ({
                code,
                expiresAt: expiresAtBJ,
                creator: creator.userId,
            }))
        );

        return NextResponse.json({ codes, expiresAtBJ, creatorUsername });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "生成邀请码失败" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // ✅ 检查用户身份
        const user = requireAuth(req);
        if (!user) {
            return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });
        }
        if (user.role !== 1) {
            return NextResponse.json({ error: "无权限" }, { status: 403 });
        }

        // ✅ 查询所有邀请码
        const codes = await db
            .select({
                code: invites.code,
                creator: users.username, // ← 取用户名
                used: invites.used,
                usedBy: usedUser.username,
                createdAt: invites.createdAt,
                expiresAt: invites.expiresAt,
            })
            .from(invites)
            .innerJoin(users, eq(users.id, invites.creator))
            .leftJoin(usedUser, eq(usedUser.id, invites.usedBy));

        return NextResponse.json(codes);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "获取邀请码失败" }, { status: 500 });
    }
}
