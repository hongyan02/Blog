import { desc, isNull } from "drizzle-orm";
import { db } from "@server/db/db";
import { timelines } from "@server/db/schema";

export async function timelineCreateServer(
    title: string,
    content: string,
    bvid: string,
    eventDate: Date
) {
    // eventDate 转换为日期字符串格式
    const finalEventDate = eventDate
        ? new Date(eventDate).toISOString().split("T")[0] // 转换为 YYYY-MM-DD 格式
        : new Date().toISOString().split("T")[0]; // 当前日期的 YYYY-MM-DD 格式

    const rows = await db
        .insert(timelines)
        .values({
            title,
            content,
            bvid: bvid ?? null,
            eventDate: finalEventDate,
        })
        .returning();

    return rows;
}

export async function timelineGetServer() {
    try {
        const rows = await db
            .select()
            .from(timelines)
            .where(isNull(timelines.deletedAt))
            .orderBy(desc(timelines.eventDate));

        return rows;
    } catch (err) {
        console.error("数据库获取错误:", err);
        return [];
    }
}
