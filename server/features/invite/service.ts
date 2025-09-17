import { toZonedTime } from "date-fns-tz";
import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@server/db/db";
import { invites, users } from "@server/db/schema";
import type { User } from "@server/db/schema";

//创建邀请码
export async function inviteCreateServer(user: User, count: number = 1) {
    // 最少 1 个，最多 50 个
    const validCount = Math.min(Math.max(Number(count) || 1, 1), 50);
    // 当前 UTC 时间
    const expiresAt = new Date();
    // 加上3天
    expiresAt.setDate(expiresAt.getDate() + 3);
    //转为北京时间
    const expiresAtBJ = toZonedTime(expiresAt, "Asia/Shanghai");
    //生成邀请码
    const codes = Array.from({ length: validCount }, () => generateCode());

    const creator = user.id;
    const creatorName = user.username;
    //插入数据库
    await db.insert(invites).values(
        codes.map((code) => ({
            code,
            expiresAt: expiresAtBJ,
            creator: creator,
        }))
    );

    return {
        codes,
        expiresAtBJ,
        creator,
        creatorName,
    };
}

//查询邀请码
export async function inviteGetServer() {
    const usedUser = alias(users, "usedUser");
    const codes = await db
        .select({
            code: invites.code,
            creator: users.username, // ← 取用户名
            used: invites.used,
            usedBy: usedUser.username,
            createdAt: invites.createdAt,
            expiresAt: invites.expiresAt,
        })
        .from(invites)
        .innerJoin(users, eq(users.id, invites.creator))
        .leftJoin(usedUser, eq(usedUser.id, invites.usedBy));

    return codes;
}

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateCode(length = 16) {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += BASE58.charAt(Math.floor(Math.random() * BASE58.length));
    }
    return code;
}
