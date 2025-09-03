import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/db/db";
import { timelines } from "@/features/db/schema";
import { desc, isNull } from "drizzle-orm";
import { requireAuth } from "@/features/auth/auth";

export async function GET() {
    const rows = await db
        .select()
        .from(timelines)
        .where(isNull(timelines.deletedAt))
        .orderBy(desc(timelines.eventDate));

    return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
    const { title, content, eventDate, bvid } = await req.json();

    // 校验必填字段
    if (!title) {
        return NextResponse.json({ error: "缺少标题" }, { status: 400 });
    }

    if (!content) {
        return NextResponse.json({ error: "缺少内容" }, { status: 400 });
    }

    const user = requireAuth(req);
    if (!user) {
        return NextResponse.json({ error: "未登录或 token 无效" }, { status: 401 });
    }
    if (user.role !== 1) {
        return NextResponse.json({ error: "无权限" }, { status: 403 });
    }

    // eventDate 转换为日期字符串格式
    const finalEventDate = eventDate
        ? new Date(eventDate).toISOString().split("T")[0] // 转换为 YYYY-MM-DD 格式
        : new Date().toISOString().split("T")[0]; // 当前日期的 YYYY-MM-DD 格式

    // 插入数据
    const rows = await db
        .insert(timelines)
        .values({
            title,
            content,
            bvid: bvid ?? null,
            eventDate: finalEventDate,
        })
        .returning();

    return NextResponse.json({ data: rows });
}
