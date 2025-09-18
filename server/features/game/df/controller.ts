import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { getUser } from "@server/features/auth/utils";
import {
    publicGunCodeGetServer,
    guncodeGetServer,
    guncodeCreateServer,
    guncodeDeleteServer,
} from "./service";

export async function publicGunCodeGetController(c: Context) {
    try {
        const data = await publicGunCodeGetServer();

        return c.json({ data });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "获取失败";
        return c.json({ error: msg }, 400);
    }
}

export async function guncodeGetController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);

    if (!user) {
        return c.json({ error: "未登录" }, 401);
    }
    try {
        const data = await guncodeGetServer(user);
        return c.json({ data });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "登陆失败";
        return c.json({ error: msg }, 400);
    }
}

export async function guncodeCreateController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);
    if (!user) {
        return c.json({ error: "未登录" }, 401);
    }
    const body = await c.req.json();
    const { weaponName, gunCode, description, isPublic } = body;
    try {
        const data = await guncodeCreateServer(weaponName, gunCode, description, isPublic, user);
        return c.json({ data }, 200);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "登陆失败";
        return c.json({ error: msg }, 400);
    }
}

export async function guncodeDeleteController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);
    if (!user) {
        return c.json({ error: "未登录" }, 401);
    }
    const body = await c.req.json();
    const { id } = body;
    try {
        const data = await guncodeDeleteServer(id, user);

        return c.json(data, 200);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "登陆失败";
        return c.json({ error: msg }, 400);
    }
}
