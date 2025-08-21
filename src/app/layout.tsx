import type { Metadata } from "next";
import "./globals.css";
import SideBar from "@/features/sidebar/ui/SideBar";

export const metadata: Metadata = {
    title: "AgCl",
    description: "AgCl's blog",
    icons: "/favicon.ico",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN">
            <body className="w-full h-full flex flex-row">
                <div className="w-1/5 h-screen overflow-y-auto p-3 bg-gray-100/50 border-r-2 border-gray-200">
                    <SideBar />
                </div>
                <div className="w-4/5 h-screen overflow-y-auto">{children}</div>
            </body>
        </html>
    );
}
