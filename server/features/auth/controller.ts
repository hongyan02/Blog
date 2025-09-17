import HonoContext from "hono";
import { setCookie } from "hono/cookie";
import { getUser } from "@server/features/auth/utils";
import { loginService, registerService } from "./service";

//获取已登陆用户信息
export async function meController(c: any) {
    try {
        const token = c.req.cookie("session"); // Hono 获取 cookie
        const user = await getUser(token);

        if (!user) {
            return c.json({ error: "未登录" }, 401);
        }

        return c.json({
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                createtime: user.createdAt,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "服务器错误";
        return c.json({ error: msg }, 500);
    }
}

//登陆
export async function loginController(c: any) {
    const body = await c.req.json();
    const { username, password } = body;

    if (!username || !password) {
        return c.json({ error: "用户名和密码必须提供" }, 400);
    }

    try {
        const { token, userInfo } = await loginService(username, password);

        // 设置 cookie
        setCookie(c, "session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        setCookie(c, "user_info", JSON.stringify(userInfo), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return c.json({ message: "登录成功" });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "登陆失败";
        return c.json({ error: msg }, 400);
    }
}

//注册
export async function registerController(c: any) {
    const body = await c.req.json();
    const { username, password, inviteCode } = body;

    if (!username || !password || !inviteCode) {
        return c.json({ error: "未填写的参数" }, 400);
    }

    try {
        const { token, userInfo } = await registerService(username, password, inviteCode);

        // 设置 cookie
        setCookie(c, "session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        setCookie(c, "user_info", JSON.stringify(userInfo), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return c.json({ message: "注册成功" });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "注册失败";
        return c.json({ error: msg }, 400);
    }
}
