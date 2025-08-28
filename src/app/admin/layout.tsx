import AnyBar from "@/features/sidebar/AnyBar";
import { AuthProvider } from "@/features/auth/components/AuthContext";
import { Providers } from "@/shared/providers";
import AdminBarClient from "@/features/sidebar/ui/AdminBarClient";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    const items: { title: string; slug: string }[] = [
        {
            title: "邀请码",
            slug: "invite",
        },
    ];
    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200">
                <AnyBar barComponent={AdminBarClient} items={items} />
            </aside>
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto">
                    {/*登录页和注册页不显示用户头*/}

                    <Providers>{children}</Providers>
                </main>
            </AuthProvider>
        </div>
    );
}
