"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactElement } from "react";
import { cn } from "@/shared/utils";
import HomeIcon from "@/shared/icons/Home";
import GameIcon from "@/shared/icons/Game";
import PostIcon from "@/shared/icons/Post";
import TimeLineIcon from "@/shared/icons/TimeLine";
import MixIcon from "@/shared/icons/Mix";

export default function SideBar() {
    const pathSegment = useSelectedLayoutSegment();

    type IconProps = {
        className?: string;
        size?: number;
    };
    interface Item {
        name: string;
        path: string;
        segment: string | null;
        Icon: (props: IconProps) => ReactElement;
    }

    const items: Item[] = [
        { name: "首页", path: "/", segment: null, Icon: HomeIcon },
        { name: "文章", path: "/posts", segment: "posts", Icon: PostIcon },
        { name: "游戏", path: "/games", segment: "games", Icon: GameIcon },
        { name: "时间轴", path: "timeline", segment: "timeline", Icon: TimeLineIcon },
        { name: "图片墙", path: "/pic", segment: "pic", Icon: MixIcon },
    ];

    return (
        <nav className="w-full h-full p-2">
            <ul className=" flex flex-col gap-1">
                {items.map(({ name, path, segment, Icon }) => (
                    <li key={path} className="w-full hover:bg-gray-200 rounded-md">
                        <Link
                            href={path}
                            className={cn(
                                "w-full p-2 flex flex-row items-center space-x-2 rounded-md",
                                pathSegment === segment ? "bg-black text-white" : "text-black"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-lg font-medium">{name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
