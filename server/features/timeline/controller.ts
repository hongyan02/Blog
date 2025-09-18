import { Context } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { getUser } from "@server/features/auth/utils";
import { timelineCreateServer, timelineGetServer } from "./service";

export async function timelineCreateController(c: Context) {
    const token = getCookie(c, "session");
    const user = await getUser(token);

    if (!user) {
        return c.json({ error: "未登录" }, 401);
    }
    if (user.role !== 1) {
        return c.json({ error: "无权限" }, 403);
    }

    const body = await c.req.json();
    const { title, content, eventDate, bvid } = body;

    if (!title) {
        return c.json({ error: "缺少标题!" }, 400);
    }
    if (!content && !bvid) {
        return c.json({ error: "缺少内容!" }, 400);
    }
    if (!eventDate) {
        return c.json({ error: "缺少时间!" }, 400);
    }
    try {
        const message = await timelineCreateServer(title, content, bvid, eventDate);
        return c.json({ success: "添加成功！" }, 200);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "创建失败";
        return c.json({ error: msg }, 400);
    }
}

export async function timelineGetController(c: Context) {
    try {
        const data = await timelineGetServer();
        return c.json(data);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "获取失败";
        return c.json({ error: msg }, 400);
    }
}
