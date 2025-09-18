import { Hono } from "hono";
import { meController, loginController, registerController, logoutController } from "./controller";

const authRoute = new Hono();

authRoute.post("/me", meController);
authRoute.post("/login", loginController);
authRoute.post("/register", registerController);
authRoute.post("/logout", logoutController);

export default authRoute;
