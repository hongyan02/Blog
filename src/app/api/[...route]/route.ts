import { handle } from "hono/vercel";
import { app } from "@server/api/index";

// 导出 CRUD 全部方法，Next 会按需调用
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
