"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils";

interface AdminItem {
    title: string;
    slug: string;
}
interface Props {
    datasource: AdminItem[];
}

export default function AdminBarClient({ datasource }: Props) {
    const pathname = decodeURIComponent(usePathname());
    return (
        <nav>
            <ul className="flex flex-col gap-1">
                {datasource.map((item) => (
                    <li key={item.slug} className="w-full rounded-md hover:bg-gray-200">
                        <Link
                            href={`/admin/${item.slug}`}
                            className={cn(
                                "w-full p-2 flex flex-col space-y-1 rounded-md",
                                pathname.startsWith(`/admin/${item.slug}`)
                                    ? "text-white bg-black"
                                    : "text-black"
                            )}
                        >
                            <h1 className="text-lg font-medium">{item.title}</h1>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
