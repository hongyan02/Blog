export default function TimeLineSkeleton() {
    return (
        <div className="flex flex-row mb-4 animate-pulse">
            {/* 左侧时间点+中线骨架 */}
            <div className="h-auto flex flex-col items-center relative min-h-[200px]">
                {/* 时间点骨架 */}
                <div className="w-24 h-9 rounded-md bg-gray-300 dark:bg-gray-600"></div>
                {/* 线骨架 */}
                <div className="absolute top-8 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* 右侧内容骨架 */}
            <div className="h-full pl-8 flex-1">
                {/* 标题骨架 */}
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>

                {/* 内容骨架 */}
                <div className="space-y-3 mb-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>

                {/* 轮播图容器骨架 */}
                <div className="relative w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shimmer"></div>
                    {/* 圆点指示器骨架 */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
