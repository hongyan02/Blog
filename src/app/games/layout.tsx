import AnyBar from "@/components/sidebar/AnyBar";
import GameBarClient from "@/components/sidebar/ui/GameBarClient";
import { AuthProvider } from "@/components/auth/AuthContext";
import { Providers } from "@/shared/providers";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    const items: { title: string; slug: string }[] = [
        {
            title: "三角洲行动",
            slug: "df",
        },
        {
            title: "丝之歌",
            slug: "Hollow_Knight_Silksong",
        },
    ];

    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200">
                <AnyBar barComponent={GameBarClient} items={items} />
            </aside>
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto grid-background">
                    <Providers>{children}</Providers>
                </main>
            </AuthProvider>
        </div>
    );
}
