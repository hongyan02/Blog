"use client";
import AnyBar from "@/features/sidebar/AnyBar";
import GameBarClient from "@/features/sidebar/ui/GameBarClient";
import { AuthProvider } from "@/features/auth/components/AuthContext";
import { UserHeader } from "@/shared/ui/UserHeader";
import { usePathname } from "next/navigation";
import { Providers } from "@/shared/providers";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideUserHeader = ["/games/login", "/games/register"].includes(pathname);
    const items: { title: string; slug: string }[] = [
        {
            title: "三角洲行动",
            slug: "df",
        },
    ];
    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200">
                <AnyBar barComponent={GameBarClient} items={items} />
            </aside>
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto grid-background">
                    {/*登录页和注册页不显示用户头*/}

                    {!hideUserHeader && <UserHeader />}
                    <Providers>{children}</Providers>
                </main>
            </AuthProvider>
        </div>
    );
}
