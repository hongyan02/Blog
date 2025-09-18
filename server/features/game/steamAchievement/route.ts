import { Hono } from "hono";
import { steamAchievementController } from "./controller";

const steamAchievementRoute = new Hono();

steamAchievementRoute.get("/steamAchievement", steamAchievementController);

export default steamAchievementRoute;
