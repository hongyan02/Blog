import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlight from "rehype-highlight";

export async function markdownToHtml(markdown: string) {
    const file = await remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeHighlight)
        .use(rehypeStringify)
        .process(markdown);
    return String(file);
}

export async function decodeMD(content: string) {
    // 把 Markdown 转成 HTML
    const htmlContent = await markdownToHtml(content);
    return htmlContent;
}
