import { Hono } from "hono";
import { HelloRoute } from "@server/api/routes/hello";
import authRoute from "@server/features/auth/route";

const app = new Hono().basePath("/api");

app.route("/hello", HelloRoute);
//me & 登陆 & 注册
app.route("/auth", authRoute);

export { app };

export type AppType = typeof app;
