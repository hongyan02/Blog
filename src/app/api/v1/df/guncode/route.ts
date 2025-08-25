import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";
import { requireAuth } from "@/features/auth/auth";
import { z } from "zod";
import { and, eq, isNull, desc } from "drizzle-orm";
import { weaponBuilds, users } from "@/db/schema";

const createBuildBodySchema = z.object({
    weaponName: z.string().min(1).max(64),
    gunCode: z.string().min(1),
    description: z.string().min(1),
    isPublic: z.boolean().default(false),
});

export async function POST(req: NextRequest) {
    try {
        // 身份验证
        const user = requireAuth(req);
        if (!user) return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });

        // 解析请求体
        const body = await req.json();
        const parsed = createBuildBodySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "参数错误", details: parsed.error.flatten },
                { status: 400 }
            );
        }

        const { weaponName, gunCode, description, isPublic } = parsed.data;
        // 3. 入库
        const [newGunCode] = await db
            .insert(weaponBuilds)
            .values({
                ownerId: user.userId, // 当前登录用户
                weaponName,
                gunCode,
                description,
                isPublic,
            })
            .returning(); // PostgreSQL 需要 .returning() 取回生成字段

        // 4. 返回
        return NextResponse.json({ data: newGunCode }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // 1. 身份校验
        const user = requireAuth(req);
        if (!user) return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });

        // 2. 查询个人方案
        const list = await db
            .select({
                id: weaponBuilds.id,
                weaponName: weaponBuilds.weaponName,
                gunCode: weaponBuilds.gunCode,
                description: weaponBuilds.description,
                isPublic: weaponBuilds.isPublic,
                createdAt: weaponBuilds.createdAt,
                username: users.username,
                avatar: users.avatar,
            })
            .from(weaponBuilds)
            .innerJoin(users, eq(users.id, weaponBuilds.ownerId))
            .where(and(eq(weaponBuilds.ownerId, user.userId), isNull(weaponBuilds.deletedAt)))
            .orderBy(desc(weaponBuilds.createdAt));

        // 3. 返回
        return NextResponse.json({ data: list }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const user = requireAuth(req);
        if (!user) return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });
        const body = await req.json();
        const parsed = z.object({ id: z.string().uuid() }).safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "参数错误", details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const { id } = parsed.data;

        // 查询并校验
        const rows = await db
            .select({ ownerId: weaponBuilds.ownerId })
            .from(weaponBuilds)
            .where(and(eq(weaponBuilds.id, id), isNull(weaponBuilds.deletedAt)));

        if (rows.length === 0) {
            return NextResponse.json({ error: "方案不存在" }, { status: 404 });
        }
        if (rows[0].ownerId !== user.userId) {
            return NextResponse.json({ error: "无权限" }, { status: 403 });
        }

        // 逻辑删除
        await db.update(weaponBuilds).set({ deletedAt: new Date() }).where(eq(weaponBuilds.id, id));

        return NextResponse.json({ data: { id } }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}
