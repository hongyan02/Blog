import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/features/auth/auth";
import { db } from "@/features/db/db";
import { eq } from "drizzle-orm";
import { users } from "@/features/db/schema";

export async function GET(req: NextRequest) {
    try {
        const payload = requireAuth(req);
        if (!payload) throw new Error("未登录");
        const { userId } = payload;

        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) throw new Error("用户不存在");

        return NextResponse.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                createtime: user.createdAt,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 401 });
    }
}
