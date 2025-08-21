import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/shared/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "@/features/auth/jwt";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 400 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return NextResponse.json({ error: "密码错误" }, { status: 400 });

    if (user.status !== 0) return NextResponse.json({ error: "账号不可用" }, { status: 403 });

    const token = signToken({ userId: user.id, username: user.username, role: user.role });

    return NextResponse.json(
        { user: { id: user.id, username: user.username, role: user.role } },
        {
            status: 200,
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`, // 7天
            },
        }
    );
}
