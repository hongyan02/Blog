import { NextResponse } from "next/server";
import { getUser } from "@/features/auth/session";

export async function GET() {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "未登录" }, { status: 401 });
        }

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
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
