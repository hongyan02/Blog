"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

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
    ImageIcon,
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

    // 自定义图片组件
    const ImageComponent = ({ node, updateAttributes, selected }: any) => {
        const [showControls, setShowControls] = useState(false);
        const { src, alt, title, width, style } = node.attrs;

        const handleSizeChange = (newWidth: string) => {
            const newStyle = `width: ${newWidth}px; height: auto;`;
            updateAttributes({
                width: parseInt(newWidth),
                style: newStyle
            });
        };

        const handleAlignChange = (align: string) => {
            let newStyle = style || 'max-width: 100%; height: auto;';
            
            switch (align) {
                case 'left':
                    newStyle += ' float: left; margin: 0 10px 10px 0;';
                    break;
                case 'center':
                    newStyle += ' display: block; margin: 0 auto;';
                    break;
                case 'right':
                    newStyle += ' float: right; margin: 0 0 10px 10px;';
                    break;
                case 'inline':
                    newStyle += ' display: inline-block; margin: 0 5px;';
                    break;
            }
            
            updateAttributes({ style: newStyle });
        };

        return (
            <NodeViewWrapper className="relative inline-block">
                <div 
                    className={`relative group ${
                        selected ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onMouseEnter={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <img
                        src={src}
                        alt={alt || ''}
                        title={title || ''}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            ...(() => {
                                if (style) {
                                    const styleObj: any = {};
                                    style.split(';').forEach((s: string) => {
                                        const [key, value] = s.split(':').map((str: string) => str.trim());
                                        if (key && value) {
                                            const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase());
                                            styleObj[camelKey] = value;
                                        }
                                    });
                                    return styleObj;
                                }
                                return {};
                            })()
                        }}
                    />
                    
                    {/* 悬浮控制按钮 */}
                    {showControls && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded-lg p-2 flex gap-1">
                            {/* 尺寸按钮 */}
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleSizeChange('200')}
                                title="小图 (200px)"
                            >
                                <span className="text-xs">S</span>
                            </button>
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleSizeChange('400')}
                                title="中图 (400px)"
                            >
                                <span className="text-xs">M</span>
                            </button>
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleSizeChange('600')}
                                title="大图 (600px)"
                            >
                                <span className="text-xs">L</span>
                            </button>
                            
                            {/* 对齐按钮 */}
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleAlignChange('left')}
                                title="左对齐"
                            >
                                <span className="text-xs">←</span>
                            </button>
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleAlignChange('center')}
                                title="居中"
                            >
                                <span className="text-xs">↕</span>
                            </button>
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleAlignChange('right')}
                                title="右对齐"
                            >
                                <span className="text-xs">→</span>
                            </button>
                            <button
                                className="p-1 text-white hover:bg-gray-600 rounded"
                                onClick={() => handleAlignChange('inline')}
                                title="并排显示"
                            >
                                <span className="text-xs">↔</span>
                            </button>
                        </div>
                    )}
                </div>
            </NodeViewWrapper>
        );
    };

    // 自定义图片扩展
    const CustomImage = Image.extend({
        addNodeView() {
            return ReactNodeViewRenderer(ImageComponent);
        },
    });

    // 处理插入图片URL
    const handleImageUpload = () => {
        const imageUrl = prompt("请输入图片URL地址:");
        if (imageUrl && imageUrl.trim()) {
            // 验证URL格式
            try {
                new URL(imageUrl);
                // URL格式有效，插入图片
                editor?.chain().focus().setImage({ src: imageUrl.trim() }).run();
            } catch (error) {
                alert("请输入有效的图片URL地址");
            }
        }
    };

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
            CustomImage.configure({
                inline: true,
                allowBase64: true,
            }),
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
                        <ToolbarButton onClick={handleImageUpload} title="插入图片">
                            <ImageIcon size={16} />
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
