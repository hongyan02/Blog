"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Heading1,
    Heading2,
    Heading3,
} from "lucide-react";

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
}

function ToolbarButton({ onClick, isActive, disabled, children, title }: ToolbarButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`
                p-2 rounded-md transition-colors duration-200
                ${
                    isActive
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            {children}
        </button>
    );
}

interface MarkdownEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
}
export default function MarkdownEditor({
    content = "# Hello Tiptap Markdown\n\n**你好，Markdown！**",
    onChange,
}: MarkdownEditorProps) {
    const [, forceUpdate] = useState({});

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "开始写作...",
            }),
            Markdown,
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const storage = editor.storage as { markdown?: { getMarkdown(): string } };
            const markdown = storage.markdown?.getMarkdown() || "";
            onChange?.(markdown);
        },
        onSelectionUpdate: () => forceUpdate({}),
        onTransaction: () => forceUpdate({}),
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-w-none min-h-[300px] p-4 focus:outline-none",
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            {/* 工具栏 */}
            <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-wrap gap-1">
                    {/* 撤销/重做 */}
                    <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                            title="撤销"
                        >
                            <Undo size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                            title="重做"
                        >
                            <Redo size={16} />
                        </ToolbarButton>
                    </div>

                    {/* 标题 */}
                    <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive("heading", { level: 1 })}
                            title="标题 1"
                        >
                            <Heading1 size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive("heading", { level: 2 })}
                            title="标题 2"
                        >
                            <Heading2 size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor.isActive("heading", { level: 3 })}
                            title="标题 3"
                        >
                            <Heading3 size={16} />
                        </ToolbarButton>
                    </div>

                    {/* 文本格式 */}
                    <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive("bold")}
                            title="粗体"
                        >
                            <Bold size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive("italic")}
                            title="斜体"
                        >
                            <Italic size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive("strike")}
                            title="删除线"
                        >
                            <Strikethrough size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            isActive={editor.isActive("code")}
                            title="行内代码"
                        >
                            <Code size={16} />
                        </ToolbarButton>
                    </div>

                    {/* 列表 */}
                    <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive("bulletList")}
                            title="无序列表"
                        >
                            <List size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive("orderedList")}
                            title="有序列表"
                        >
                            <ListOrdered size={16} />
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive("blockquote")}
                            title="引用"
                        >
                            <Quote size={16} />
                        </ToolbarButton>
                    </div>

                    {/* 其他功能 */}
                    <div className="flex gap-1">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            isActive={editor.isActive("codeBlock")}
                            title="代码块"
                        >
                            <span className="text-xs font-mono">{"{}"}</span>
                        </ToolbarButton>
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHorizontalRule().run()}
                            title="分割线"
                        >
                            <span className="text-xs">---</span>
                        </ToolbarButton>
                    </div>
                </div>
            </div>

            {/* 编辑器内容区域 */}
            <div className="relative">
                <EditorContent
                    editor={editor}
                    className="min-h-[300px] max-h-[600px] overflow-y-auto"
                />
            </div>
        </div>
    );
}
