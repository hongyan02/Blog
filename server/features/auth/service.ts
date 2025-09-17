import bcrypt from "bcrypt";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@server/db/db";
import { users, invites } from "@server/db/schema";
import { decryptPassword } from "@/shared/crypto";
import { createSession } from "@/features/auth/session";
import { loginSchema, registerSchema } from "@server/db/valid";

export async function loginService(username: string, encryptedPassword: string) {
    //解密密码
    let decryptedPassword: string;
    try {
        decryptedPassword = decryptPassword(encryptedPassword);
    } catch {
        throw new Error("密码格式错误");
    }
    // zod 校验解密后的密码
    const parsed = loginSchema.safeParse({ username, password: decryptedPassword });
    if (!parsed.success) {
        const msg = parsed.error.issues.map((i) => i.message).join(", ");
        throw new Error(msg);
    }

    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) throw new Error("用户不存在");

    //校验密码
    const vaild = await bcrypt.compare(decryptedPassword, user.password);

    if (!vaild) throw new Error("密码错误");
    if (user.status === 1) throw new Error("账号不可用");

    //生成session
    const token = await createSession(user.id);

    return {
        token,
        userInfo: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
        },
    };
}

export async function registerService(
    username: string,
    encryptedPassword: string,
    inviteCode: string
) {
    let decryptedPassword: string;
    try {
        decryptedPassword = decryptPassword(encryptedPassword);
    } catch {
        throw new Error("密码格式错误");
    }

    const parsed = registerSchema.safeParse({ username, password: decryptedPassword });
    if (!parsed.success) {
        const msg = parsed.error.issues.map((i) => i.message).join(", ");
        throw new Error(msg);
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
    if (!invite) throw new Error("邀请码不存在");

    const hashed = await bcrypt.hash(decryptedPassword, 10);
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

    const token = await createSession(user.id);

    return {
        token,
        userInfo: {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            role: user.role,
        },
    };
}
