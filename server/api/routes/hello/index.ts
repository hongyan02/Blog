import { Hono } from "hono";

const HelloRoute = new Hono();

HelloRoute.get("/", async (c) => {
    return c.json({
        message: "Hello world",
    });
});

export { HelloRoute };
