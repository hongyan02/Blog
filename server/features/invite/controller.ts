import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import { getUser } from "@server/features/auth/utils";
import { inviteCreateServer, inviteGetServer } from "./service";

export async function inviteCreateController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);
    if (!user) {
        return c.json({ error: "未登陆" }, 401);
    }
    const body = await c.req.json();
    const { count } = body;
    if (!count) {
        return c.json({ error: "未提供生成数量" }, 400);
    }

    try {
        const { codes, expiresAtBJ, creator, creatorName } = await inviteCreateServer(user, count);
        return c.json({ codes, expiresAtBJ, creator, creatorName });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "服务器错误";
        return c.json({ error: msg }, 500);
    }
}

export async function inviteGetController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);
    if (!user) {
        return c.json({ error: "未登陆" }, 401);
    }
    try {
        const codes = await inviteGetServer();
        return c.json(codes);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "注册失败";
        return c.json({ error: msg }, 400);
    }
}
