import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AnyBar from "@/components/sidebar/AnyBar";
import { AuthProvider } from "@/components/auth/AuthContext";
import { Providers } from "@/shared/providers";
import AdminBarClient from "@/components/sidebar/ui/AdminBarClient";

interface UserCookieData {
    id: string;
    username: string;
    avatar: any;
    role: number;
}

async function checkAdminPermission(): Promise<UserCookieData | null> {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get("user_info");

    if (!userInfoCookie) {
        return null;
    }

    try {
        const userData: UserCookieData = JSON.parse(decodeURIComponent(userInfoCookie.value));

        // 验证数据完整性
        if (!userData.id || !userData.username || userData.role !== 1) {
            return null;
        }

        return userData;
    } catch (error) {
        console.warn("解析用户cookie失败:", error);
        return null;
    }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 服务端权限检查
    const user = await checkAdminPermission();

    if (!user) {
        redirect("/");
    }

    const items: { title: string; slug: string }[] = [
        {
            title: "邀请码",
            slug: "invite",
        },
        {
            title: "时间轴",
            slug: "timeline",
        },
    ];

    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200">
                <AnyBar barComponent={AdminBarClient} items={items} />
            </aside>
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto">
                    <Providers>{children}</Providers>
                </main>
            </AuthProvider>
        </div>
    );
}
