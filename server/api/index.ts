import { Hono } from "hono";
import { HelloRoute } from "@server/api/routes/hello";
import authRoute from "@server/features/auth/route";
import inviteRoute from "@server/features/invite/route";
import timelineRoute from "@server/features/timeline/route";
import { publicGunCodeRoute, guncodeRoute } from "@server/features/game/df/route";

const app = new Hono().basePath("/api");

app.route("/hello", HelloRoute);
//me & 登陆 & 注册
app.route("/auth", authRoute);

app.route("/v1", inviteRoute);

app.route("/v1", timelineRoute);

app.route("/public", publicGunCodeRoute);

app.route("/game/df", guncodeRoute);

export { app };

export type AppType = typeof app;
