import PostBarClient from "@/features/sidebar/ui/PostBarClient";
import AnyBar from "@/features/sidebar/AnyBar";
import { getAllPosts } from "@/features/md/lib/posts";

export default function PostsLayout({ children }: { children: React.ReactNode }) {
    const posts = getAllPosts();
    return (
        <div className="flex w-full h-full">
            <aside className="w-[20vw] h-full overflow-y-auto p-3 bg-gray-100/70 border-r-2 border-gray-200">
                <AnyBar
                    barComponent={PostBarClient}
                    items={posts}
                />
            </aside>
            <main className="w-[80vw] h-full p-3 overflow-auto grid-background">{children}</main>
        </div>
    );
}
