import { AuthProvider } from "@/components/auth/AuthContext";
import { Providers } from "@/shared/providers";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    // const pathname = usePathname();
    // const hideUserHeader = ["/games/login", "/games/register"].includes(pathname);

    return (
        <div className="flex w-full h-full">
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto grid-background">
                    <Providers>{children}</Providers>
                </main>
            </AuthProvider>
        </div>
    );
}
