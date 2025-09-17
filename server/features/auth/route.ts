import { Hono } from "hono";
import { meController, loginController, registerController } from "./controller";

const authRoute = new Hono();

authRoute.post("/me", meController);
authRoute.post("/login", loginController);
authRoute.post("/register", registerController);

export default authRoute;
