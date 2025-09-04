"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, formatDate } from "@/shared/utils";

interface Post {
    slug: string;
    frontmatter: {
        title?: string;
        date?: string;
        [key: string]: unknown;
    };
}

interface Props {
    datasource: Post[];
}

export default function PostBarClient({ datasource }: Props) {
    const pathname = decodeURIComponent(usePathname());

    // 按日期排序，最新的在最上面
    const sortedPosts = datasource.sort((a, b) => {
        const dateA = new Date(a.frontmatter.date || "1970-01-01");
        const dateB = new Date(b.frontmatter.date || "1970-01-01");
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <nav>
            <ul className="flex flex-col gap-1">
                {sortedPosts.map((post) => (
                    <li
                        key={post.slug}
                        className="w-full rounded-md hover:bg-gray-200"
                    >
                        <Link
                            href={`/posts/${post.slug}`}
                            className={cn(
                                "w-full p-2 flex flex-col space-y-1 rounded-md",
                                pathname === `/posts/${post.slug}`
                                    ? "text-white bg-black"
                                    : "text-black"
                            )}
                        >
                            <h1 className="text-lg font-medium">{post.frontmatter.title}</h1>
                            {post.frontmatter.date && (
                                <p className="text-sm opacity-70">
                                    {formatDate(post.frontmatter.date)}
                                </p>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
