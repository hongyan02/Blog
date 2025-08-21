import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";
import { invites } from "@/db/schema";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Base58 字符集（排除 0 O I l）
const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function generateCode(length = 16) {
    let code = "";
    for (let i = 0; i < length; i++) {
        code += BASE58.charAt(Math.floor(Math.random() * BASE58.length));
    }
    return code;
}

export async function POST(req: NextRequest) {
    try {
        // ✅ 检查用户身份
        // const { role } = requireAuth(req);
        // if (role !== 1) {
        //     return NextResponse.json({ error: "无权限" }, { status: 403 });
        // }

        // ✅ 解析请求体
        const body = await req.json().catch(() => ({}));
        const count = Math.min(Math.max(Number(body.count) || 1, 1), 50);
        // 最少 1 个，最多 50 个

        const expiresAt = new Date(); // 当前 UTC 时间
        expiresAt.setDate(expiresAt.getDate() + 3); // 加上3天
        const timeZone = "Asia/Shanghai";
        // 转换为北京时间
        const zoned = toZonedTime(expiresAt, timeZone);
        // 格式化成无时区字符串
        const expiresAtBJ = format(zoned, "yyyy-MM-dd HH:mm:ss");

        const codes = Array.from({ length: count }, () => generateCode());

        // ✅ 批量插入
        await db.insert(invites).values(
            codes.map((code) => ({
                code,
                expiresAt: zoned,
            }))
        );

        return NextResponse.json({ codes, expiresAtBJ });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "生成邀请码失败" }, { status: 500 });
    }
}
