import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import SideBar from "@/components/sidebar/ui/SideBar";

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
                    <Link
                        href="/aboutme"
                        className="flex flex-col items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
                    >
                        <Image
                            src={"/avatar.jpeg"}
                            alt="avatar"
                            width={70}
                            height={70}
                            className="rounded-full border-1 border-black"
                        />
                        <p className="text-black text-2xl">AgCl</p>
                        {/* <p className="text-black text-sm">世界以痛吻我，要我报之以歌</p> */}
                    </Link>

                    <SideBar />
                </div>
                <div className="w-4/5 h-screen overflow-y-auto">{children}</div>
            </body>
        </html>
    );
}
