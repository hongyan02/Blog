import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAuth } from "@/features/auth/auth";

export function middleware(req: NextRequest) {
    console.log("🔍 middleware hit:", req.nextUrl.pathname);
    try {
        requireAuth(req); // 会抛异常就表示未登录
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/games", req.url));
    }
}

export const config = {
    matcher: ["/"], // 需要保护的路由
};
