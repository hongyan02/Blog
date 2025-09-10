"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface ImageData {
    src: string;
    alt?: string;
}

interface ImageCarouselProps {
    images: ImageData[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showDots?: boolean;
    showNavigation?: boolean;
    className?: string;
    preserveAspectRatio?: boolean;
    maxHeight?: string;
}

// 骨架屏组件
function CarouselSkeleton({ maxHeight }: { maxHeight?: string }) {
    return (
        <div
            className="relative w-full rounded-lg overflow-hidden animate-pulse border border-gray-300 dark:border-gray-600"
            style={{ height: maxHeight || "400px" }}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 transform -skew-x-12 animate-shimmer"></div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default function ImageCarousel({
    images,
    autoPlay = false,
    autoPlayInterval = 5000,
    showDots = true,
    showNavigation = true,
    className = "",
    preserveAspectRatio = true,
    maxHeight = "600px",
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // 预加载图片
    const preloadImage = useCallback(
        (index: number) => {
            if (loadedImages.has(index)) return;

            const img = new window.Image();
            img.onload = () => {
                setLoadedImages((prev) => new Set(prev).add(index));
                if (index === 0 && isLoading) {
                    setIsLoading(false);
                }
            };
            img.onerror = () => {
                setLoadedImages((prev) => new Set(prev).add(index));
                if (index === 0 && isLoading) {
                    setIsLoading(false);
                }
            };
            img.src = images[index].src;
        },
        [images, loadedImages, isLoading]
    );

    // 自动播放逻辑
    const startAutoPlay = useCallback(() => {
        if (!autoPlay || images.length <= 1) return;
        autoPlayRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);
    }, [autoPlay, autoPlayInterval, images.length]);

    const stopAutoPlay = useCallback(() => {
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
    }, []);

    // 导航函数
    const goToSlide = useCallback(
        (index: number) => {
            if (isTransitioning || images.length <= 1) return;
            setIsTransitioning(true);
            setCurrentIndex(index);
            setTimeout(() => setIsTransitioning(false), 300);
        },
        [isTransitioning, images.length]
    );

    const goToPrevious = useCallback(() => {
        if (images.length <= 1) return;
        const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    }, [currentIndex, images.length, goToSlide]);

    const goToNext = useCallback(() => {
        if (images.length <= 1) return;
        const newIndex = (currentIndex + 1) % images.length;
        goToSlide(newIndex);
    }, [currentIndex, images.length, goToSlide]);

    // 初始化预加载
    useEffect(() => {
        if (images.length <= 1) return;
        // 预加载当前图片和相邻图片
        preloadImage(currentIndex);
        if (currentIndex > 0) preloadImage(currentIndex - 1);
        if (currentIndex < images.length - 1) preloadImage(currentIndex + 1);
    }, [currentIndex, preloadImage, images.length]);

    useEffect(() => {
        if (images.length <= 1) return;
        startAutoPlay();
        return () => stopAutoPlay();
    }, [startAutoPlay, stopAutoPlay, images.length]);

    // 键盘导航
    useEffect(() => {
        if (images.length <= 1) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                goToPrevious();
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                goToNext();
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("keydown", handleKeyDown);
            return () => container.removeEventListener("keydown", handleKeyDown);
        }
    }, [goToPrevious, goToNext, images.length]);

    // 触摸处理函数
    const handleTouchStart = (e: React.TouchEvent) => {
        if (images.length <= 1) return;
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (images.length <= 1) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (images.length <= 1 || !touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrevious();
        }
    };

    // 如果只有一张图片或没有图片，不显示轮播功能
    if (images.length <= 1) {
        return (
            <div className={`relative w-full ${className}`}>
                {images.length === 1 ? (
                    <Image
                        src={images[0].src}
                        alt={images[0].alt || ""}
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg object-contain"
                        style={{ maxHeight: preserveAspectRatio ? maxHeight : "auto" }}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                        priority
                    />
                ) : null}
                {isLoading && <CarouselSkeleton maxHeight={maxHeight} />}
            </div>
        );
    }

    if (isLoading) {
        return <CarouselSkeleton maxHeight={maxHeight} />;
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full group focus:outline-none ${className}`}
            tabIndex={0}
            onMouseEnter={stopAutoPlay}
            onMouseLeave={startAutoPlay}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* 图片容器 */}
            <div
                className={`relative w-full overflow-hidden rounded-lg ${
                    preserveAspectRatio ? "" : "aspect-video"
                }`}
                style={preserveAspectRatio ? {} : {}}
            >
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-full relative flex items-center justify-center"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || `图片 ${index + 1}`}
                                width={800}
                                height={600}
                                className={`rounded-lg ${
                                    preserveAspectRatio
                                        ? "w-full h-auto object-contain"
                                        : "w-full h-full object-cover"
                                }`}
                                style={preserveAspectRatio ? { maxHeight } : {}}
                                priority={index === 0}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* 左右导航按钮 */}
            {showNavigation && (
                <>
                    <button
                        onClick={goToPrevious}
                        disabled={isTransitioning}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                        aria-label="上一张图片"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={isTransitioning}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:opacity-50"
                        aria-label="下一张图片"
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* 圆点指示器 */}
            {showDots && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            disabled={isTransitioning}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex
                                    ? "bg-white scale-125"
                                    : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`切换到第 ${index + 1} 张图片`}
                        />
                    ))}
                </div>
            )}

            {/* 图片计数 */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
}
