import { BeanHeadProps } from "@/components/avatar";
interface UserCookieData {
    id: string;
    username: string;
    avatar: BeanHeadProps;
    role: number;
}

export function getUserFromCookie(): UserCookieData | null {
    if (typeof window === "undefined") return null;

    try {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user_info="))
            ?.split("=")[1];

        if (!cookieValue) return null;

        const decodedValue = decodeURIComponent(cookieValue);
        const userData: UserCookieData = JSON.parse(decodedValue);

        // 数据完整性验证
        if (!userData.id || !userData.username) {
            throw new Error("用户数据不完整");
        }

        return userData;
    } catch (error) {
        console.warn("解析用户cookie失败:", error);
        // 自动清理损坏的cookie
        clearUserCookie();
        return null;
    }
}

export function clearUserCookie(): void {
    if (typeof window !== "undefined") {
        document.cookie = "user_info=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
    }
}
