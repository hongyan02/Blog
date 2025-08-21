import { getPost, getAllPostSlugs } from "@/features/md/lib/posts";
import { formatDate } from "@/shared/utils";

interface PageProps {
    params: Promise<{ slug: string }>;
}
//SSG生成所有文章的静态页面
export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getPost(decodedSlug);

    return (
        <article className="prose prose-lg mx-auto p-6 min-w-[50vw]">
            <h1 className="">{decodeURIComponent(post.frontmatter.title)}</h1>
            <p>{formatDate(post.frontmatter.date)}</p>
            <div>
                {post.frontmatter.tags?.map((tag: string) => (
                    <span
                        key={tag}
                        className="px-2 py-1 bg-gray-200 rounded mr-2"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
}
