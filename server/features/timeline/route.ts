import { Hono } from "hono";
import { timelineCreateController, timelineGetController } from "./controller";

const timelineRoute = new Hono();

timelineRoute.post("/timeline", timelineCreateController);
timelineRoute.get("/timeline", timelineGetController);

export default timelineRoute;
