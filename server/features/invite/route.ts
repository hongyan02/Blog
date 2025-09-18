import { Hono } from "hono";
import { inviteCreateController, inviteGetController } from "./controller";

const inviteRoute = new Hono();

inviteRoute.post("/invites", inviteCreateController);
inviteRoute.get("/invites", inviteGetController);

export default inviteRoute;
