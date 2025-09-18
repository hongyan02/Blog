import { db } from "@server/db/db";
import { and, eq, isNull, desc } from "drizzle-orm";
import { weaponBuilds, users } from "@server/db/schema";
import type { User } from "@server/db/schema";

export async function publicGunCodeGetServer() {
    try {
        const rows = await db
            .select({
                id: weaponBuilds.id,
                weaponName: weaponBuilds.weaponName,
                gunCode: weaponBuilds.gunCode,
                description: weaponBuilds.description,
                createdAt: weaponBuilds.createdAt,
                username: users.username,
                avatar: users.avatar,
            })
            .from(weaponBuilds)
            .innerJoin(users, eq(users.id, weaponBuilds.ownerId))
            .where(and(eq(weaponBuilds.isPublic, true), isNull(weaponBuilds.deletedAt)))
            .orderBy(desc(weaponBuilds.createdAt));

        return rows;
    } catch (err) {
        console.error("数据库获取错误:", err);
        return [];
    }
}

export async function guncodeGetServer(user: User) {
    try {
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
            .where(and(eq(weaponBuilds.ownerId, user.id), isNull(weaponBuilds.deletedAt)))
            .orderBy(desc(weaponBuilds.createdAt));

        return list;
    } catch (err) {
        console.error("数据库获取错误:", err);
        return [];
    }
}

export async function guncodeCreateServer(
    weaponName: string,
    gunCode: string,
    description: string,
    isPublic: boolean,
    user: User
) {
    try {
        const [newGunCode] = await db
            .insert(weaponBuilds)
            .values({
                ownerId: user.id, // 当前登录用户
                weaponName,
                gunCode,
                description,
                isPublic,
            })
            .returning(); // PostgreSQL 需要 .returning() 取回生成字段

        return [newGunCode];
    } catch (err) {
        console.error("数据库获取错误:", err);
        return [];
    }
}

export async function guncodeDeleteServer(id: string, user: User) {
    try {
        const rows = await db
            .select({ ownerId: weaponBuilds.ownerId })
            .from(weaponBuilds)
            .where(and(eq(weaponBuilds.id, id), isNull(weaponBuilds.deletedAt)));

        if (rows.length === 0) {
            return { ok: false, error: "方案不存在", status: 404 };
        }
        if (rows[0].ownerId !== user.id) {
            return { ok: false, error: "无权限", status: 403 };
        }
        // 逻辑删除
        await db.update(weaponBuilds).set({ deletedAt: new Date() }).where(eq(weaponBuilds.id, id));
        return { ok: true, message: "删除成功！" };
    } catch (err) {
        console.error("数据库获取错误:", err);
        return null;
    }
}
