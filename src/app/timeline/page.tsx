import TimeLine from "@/components/Timeline/TimeLine";
import { db } from "@/features/db/db";
import { timelines } from "@/features/db/schema";
import { desc, isNull } from "drizzle-orm";
import { decodeMD } from "@/features/md/lib/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "TimeLine",
    description: "AgCl's blog TimeLine Page",
};

export default async function TimeLinePage() {
    // 直接在页面中查询数据库
    const rows = await db
        .select()
        .from(timelines)
        .where(isNull(timelines.deletedAt))
        .orderBy(desc(timelines.eventDate));

    // 解码 Markdown 内容
    const data = await Promise.all(
        rows.map(async (item) => ({
            ...item,
            content: await decodeMD(item.content),
        }))
    );

    return (
        <div className="grid-background min-h-screen p-3">
            <h1 className="text-4xl font-extrabold p-4">琐碎点滴</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 p-4 pt-0">
                what&apos;s happend!
            </p>
            {data.map((item) => (
                <TimeLine
                    key={item.id}
                    date={item.eventDate}
                    title={item.title}
                    content={item.content}
                    bvid={item.bvid || undefined}
                />
            ))}
        </div>
    );
}

// ISR 配置：每小时重新验证一次
export const revalidate = 3600;
