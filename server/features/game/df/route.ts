import { Hono } from "hono";
import {
    publicGunCodeGetController,
    guncodeGetController,
    guncodeCreateController,
    guncodeDeleteController,
} from "./controller";

//公共的
const publicGunCodeRoute = new Hono();

publicGunCodeRoute.get("/guncode", publicGunCodeGetController);

//个人的
const guncodeRoute = new Hono();

guncodeRoute.get("/guncode", guncodeGetController);
guncodeRoute.post("/guncode", guncodeCreateController);
guncodeRoute.delete("/guncode", guncodeDeleteController);

export { publicGunCodeRoute, guncodeRoute };
