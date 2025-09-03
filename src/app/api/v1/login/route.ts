import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/features/db/db";
import { users } from "@/features/db/schema";
import { eq } from "drizzle-orm";
import { signToken } from "@/features/auth/jwt";
import { decryptPassword } from "@/shared/crypto";

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) return NextResponse.json({ error: "用户不存在" }, { status: 400 });

    // 解密前端传来的加密密码
    let decryptedPassword: string;
    try {
        decryptedPassword = decryptPassword(password);
    } catch (error) {
        return NextResponse.json({ error: "密码格式错误" }, { status: 400 });
    }

    const valid = await bcrypt.compare(decryptedPassword, user.password);
    if (!valid) return NextResponse.json({ error: "密码错误" }, { status: 400 });

    if (user.status !== 0) return NextResponse.json({ error: "账号不可用" }, { status: 403 });

    const token = signToken({ userId: user.id, username: user.username, role: user.role });

    return NextResponse.json(
        { user: { id: user.id, username: user.username, role: user.role, avatar: user.avatar } },
        {
            status: 200,
            headers: {
                "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`, // 7天
            },
        }
    );
}
