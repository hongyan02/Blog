import { setCookie, getCookie } from "hono/cookie";
import type { Context } from "hono";
import { getUser } from "@server/features/auth/utils";
import { loginService, registerService } from "./service";

//获取已登陆用户信息
export async function meController(c: Context) {
    try {
        const token = getCookie(c, "session");
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
export async function loginController(c: Context) {
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
export async function registerController(c: Context) {
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

export async function logoutController(c: Context) {
    try {
        // 设置 cookie
        setCookie(c, "session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 0, // 立即失效
        });

        setCookie(c, "user_info", "", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: 0, // 立即失效
        });
        return c.json({ message: "退出登录成功" }, 200);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "注册失败";
        return c.json({ error: msg }, 400);
    }
}
