import { Context } from "hono";
import { steamAchievementService } from "./service";

export async function steamAchievementController(c: Context) {
    try {
        // const body = await c.req.json();
        // const { key, appid, steamid, l = "schinese" } = body;
        const key = String(c.req.query("key"));
        const appid = Number(c.req.query("appid"));
        const steamid = Number(c.req.query("steamid"));
        const l = c.req.query("l") ?? "schinese";

        const { achievements, unlocked, total } = await steamAchievementService(
            key,
            appid,
            steamid,
            l
        );

        return c.json({ achievements, unlocked, total });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "登陆失败";
        return c.json({ error: msg }, 400);
    }
}
