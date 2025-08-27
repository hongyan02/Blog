import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    // 检查是否是受保护的路径
    const isProtectedPath =
        pathname.startsWith("/games/df/store") || pathname.startsWith("/games/profile");

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL("/games/login", req.url));
    }

    return NextResponse.next();
}

// 配置 matcher 来指定中间件运行的路径
export const config = {
    matcher: ["/games/df/store/:path*", "/games/profile/:path*"],
};
