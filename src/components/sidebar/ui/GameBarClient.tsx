"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils";

interface Game {
    title: string;
    slug: string;
}
interface Props {
    datasource: Game[];
}

export default function GameBarClient({ datasource }: Props) {
    const pathname = decodeURIComponent(usePathname());
    return (
        <nav>
            <ul className="flex flex-col gap-1">
                {datasource.map((game) => (
                    <li
                        key={game.slug}
                        className="w-full rounded-md hover:bg-gray-200"
                    >
                        <Link
                            href={`/games/${game.slug}`}
                            className={cn(
                                "w-full p-2 flex flex-col space-y-1 rounded-md",
                                pathname.startsWith(`/games/${game.slug}`)
                                    ? "text-white bg-black"
                                    : "text-black"
                            )}
                        >
                            <h1 className="text-lg font-medium">{game.title}</h1>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
