"use client";

import { ReactElement, useEffect, useRef, useState } from "react";
import ImageCarousel from "@/components/ImageCarousel";

type Props = {
    date: string;
    title: string;
    content?: ReactElement | string;
    bvid?: string;
};

// 图片检测和处理工具
interface ImageInfo {
    src: string;
    alt?: string;
}

function detectAndGroupImages(htmlContent: string): {
    content: string;
    carousels: Array<{ id: string; images: ImageInfo[] }>;
} {
    if (typeof window === "undefined") {
        return { content: htmlContent, carousels: [] };
    }

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    const carousels: Array<{ id: string; images: ImageInfo[] }> = [];

    // 查找所有段落中的图片
    const paragraphs = tempDiv.querySelectorAll("p");

    paragraphs.forEach((paragraph, pIndex) => {
        const images = paragraph.querySelectorAll("img");

        // 如果段落中有2张或以上图片，转换为轮播
        if (images.length >= 2) {
            const imageData: ImageInfo[] = Array.from(images).map((img) => ({
                src: img.src,
                alt: img.alt || "",
            }));

            const carouselId = `carousel-${pIndex}`;
            carousels.push({ id: carouselId, images: imageData });

            // 创建轮播占位符
            paragraph.innerHTML = `<div class="carousel-placeholder" data-carousel-id="${carouselId}"></div>`;
        }
    });

    return { content: tempDiv.innerHTML, carousels };
}

// 轮播内容组件
function CarouselContent({ content }: { content: string }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [carousels, setCarousels] = useState<Array<{ id: string; images: ImageInfo[] }>>([]);

    useEffect(() => {
        if (contentRef.current && typeof content === "string") {
            const { content: processedContent, carousels: detectedCarousels } =
                detectAndGroupImages(content);

            // 设置处理后的内容
            contentRef.current.innerHTML = processedContent;
            setCarousels(detectedCarousels);

            // 渲染轮播组件到占位符位置
            detectedCarousels.forEach((carousel) => {
                const placeholder = contentRef.current?.querySelector(
                    `[data-carousel-id="${carousel.id}"]`
                );
                if (placeholder) {
                    // 清空占位符并添加一个用于React渲染的容器
                    placeholder.innerHTML = "";
                    placeholder.setAttribute("data-react-carousel", carousel.id);
                }
            });
        }
    }, [content]);

    return (
        <div className="prose dark:prose-invert max-w-none text-lg">
            <div ref={contentRef} />
            {/* 通过Portal渲染轮播组件 */}
            {carousels.map((carousel) => (
                <CarouselPortal
                    key={carousel.id}
                    carouselId={carousel.id}
                    images={carousel.images}
                />
            ))}
        </div>
    );
}

// 轮播门户组件
function CarouselPortal({ carouselId, images }: { carouselId: string; images: ImageInfo[] }) {
    const [container, setContainer] = useState<Element | null>(null);

    useEffect(() => {
        const element = document.querySelector(`[data-react-carousel="${carouselId}"]`);
        if (element) {
            setContainer(element);
        }
    }, [carouselId]);

    if (!container) return null;

    // 直接在容器中渲染轮播组件
    return (
        <div
            ref={(el) => {
                if (el && container && !container.hasChildNodes()) {
                    container.appendChild(el);
                }
            }}
            className="my-4"
        >
            <ImageCarousel
                images={images}
                autoPlay={true}
                autoPlayInterval={6000}
                showDots={true}
                showNavigation={true}
                className="w-full"
                preserveAspectRatio={true}
                maxHeight="500px"
            />
        </div>
    );
}
export default function TimeLine(item: Props) {
    const bilibiliUrl = item.bvid
        ? `https://player.bilibili.com/player.html?bvid=${item.bvid}&autoplay=0`
        : undefined;
    return (
        <div className="flex flex-row mb-4">
            {/* 左侧时间点+中线 */}
            <div className="h-auto flex flex-col items-center relative min-h-[200px]">
                {/* 时间点 */}
                <div className="w-24 h-9 rounded-md bg-black text-white text-sm flex justify-center items-center">
                    {item.date}
                </div>

                {/* 线 */}
                <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-black"></div>
            </div>

            {/* 右侧内容 */}
            <div className="h-full pl-8">
                <div className="font-bold text-3xl flex items-center">{item.title}</div>
                {/* 渲染 Markdown 转换后的 HTML 内容，支持轮播图 */}
                {typeof item.content === "string" ? (
                    <CarouselContent content={item.content} />
                ) : (
                    <div className="text-lg">{item.content}</div>
                )}
                {/* B 站外链播放器 */}
                {bilibiliUrl && (
                    <div className="mt-4 aspect-video w-full min-w-[600px] min-h-[500px]">
                        <iframe
                            src={bilibiliUrl}
                            allowFullScreen={true}
                            sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts allow-popups"
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-lg"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
