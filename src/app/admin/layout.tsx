"use client";
import AnyBar from "@/features/sidebar/AnyBar";
import { AuthProvider } from "@/features/auth/components/AuthContext";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function GamesLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [queryClient] = useState(() => new QueryClient());
    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200"></aside>
            <AuthProvider>
                <main className="w-[80vw] h-full p-3 overflow-auto">
                    {/*登录页和注册页不显示用户头*/}

                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </main>
            </AuthProvider>
        </div>
    );
}
