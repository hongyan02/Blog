import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown"; // 你写的remark/rehype方法

//获取aboutme
// export async function getAboutMe() {
//     const filePath = path.join(process.cwd(), "contents/", `aboutme.md`);
//     const fileContents = fs.readFileSync(filePath, "utf-8");
//     // gray-matter 解析
//     const { data, content } = matter(fileContents);

//     // 把 Markdown 转成 HTML
//     const htmlContent = await markdownToHtml(content);

//     return {
//         frontmatter: data, // { title, date, tags }
//         content: htmlContent,
//     };
// }

// 获取文章详情
export async function getPost(slug: string) {
    const filePath = path.join(process.cwd(), "contents/posts", `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf-8");

    // gray-matter 解析
    const { data, content } = matter(fileContents);

    // 把 Markdown 转成 HTML
    const htmlContent = await markdownToHtml(content);

    return {
        frontmatter: data, // { title, date, tags }
        content: htmlContent,
    };
}

// 获取所有文章的 slug
export function getAllPostSlugs() {
    const postsDir = path.join(process.cwd(), "contents/posts");
    const files = fs.readdirSync(postsDir); // 获取所有文件名
    return files.filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")); // 去掉扩展名
}

// 获取所有文章的信息（包含frontmatter）
export function getAllPosts() {
    const postsDir = path.join(process.cwd(), "contents/posts");
    const files = fs.readdirSync(postsDir);

    const posts = files
        .filter((f) => f.endsWith(".md"))
        .map((file) => {
            const slug = file.replace(/\.md$/, "");
            const filePath = path.join(postsDir, file);
            const fileContents = fs.readFileSync(filePath, "utf-8");
            const { data } = matter(fileContents);

            return {
                slug,
                frontmatter: data,
            };
        });

    return posts;
}
