import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/games/df/store", "/games/profile"];

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

    if (!token && isProtected) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}
