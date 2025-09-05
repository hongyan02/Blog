import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("session")?.value;

    // 2. 未登录 → 跳登录
    if (!token) {
        if (
            pathname.startsWith("/games/df/store") ||
            pathname.startsWith("/games/profile") ||
            pathname.startsWith("/admin")
        ) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        return NextResponse.next();
    }

    //已登陆用户不再访问登陆注册页面
    if (pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 3. 管理员路由权限
    // if (pathname.startsWith("/admin") && user.role !== 1) {
    //     return NextResponse.redirect(new URL("/403", req.url));
    // }

    // 4. 其余放行
    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/:path*", "/games/df/store/:path*", "/games/profile/:path*", "/admin/:path*"],
};
