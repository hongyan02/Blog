import crypto from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/features/db/db";
import { sessions, users } from "@/features/db/schema";
import type { Session, User } from "@/features/db/schema";

//创建session
export async function createSession(userId: string) {
    //生成id
    const id = crypto.randomUUID();
    //生成随机32位二进制密钥
    const secret = crypto.randomBytes(32);
    //将二进制密钥转换为字符串
    const secretHex = secret.toString("hex");
    // 哈希 secret 存数据库（SHA-256）
    const secretHash = crypto.createHash("sha256").update(secretHex).digest("hex");
    //生成日期
    const now = new Date();

    await db.insert(sessions).values({
        id,
        secretHash,
        userId: userId,
        lastVerifiedAt: now,
        createdAt: now,
    });

    //返回id和密钥字符串
    return `${id}.${secretHex}`;
}

//验证session.Secret
export async function verifySecret(secretHex: string, storedHash: string) {
    //将传入的密钥转换为hash值
    const hash = crypto.createHash("sha256").update(secretHex).digest("hex");
    //长度不等直接返回 false，避免timingSafeEqual抛错
    if (hash.length !== storedHash.length) return false;
    //比较数据库中的密钥和传入的密钥hash值是否相等
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
}

//获取session并更新lastVerifiedAt
export async function verifySessionToken(token: string): Promise<Session | null> {
    const [id, secretHex] = token.split(".");
    if (!id || !secretHex) return null;

    const [row] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!row) return null;

    const ok = await verifySecret(secretHex, row.secretHash);
    if (!ok) return null;

    // 更新最后验证时间
    await db.update(sessions).set({ lastVerifiedAt: new Date() }).where(eq(sessions.id, id));

    return row;
}

//获取当前用户信息
export const getUser = cache(async (): Promise<User | null> => {
    //获取cookie中的id和密钥
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    //验证密钥
    const session = await verifySessionToken(token);
    if (!session) return null;
    //获取用户信息
    const [user] = await db.select().from(users).where(eq(users.id, session.userId));

    return user ?? null;
});
