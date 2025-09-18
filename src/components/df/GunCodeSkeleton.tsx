export function GunCodeSkeleton() {
    return (
        <div className="rounded-md border-2 border-gray-200 bg-white/20 backdrop-blur-md p-4 h-40 flex flex-col justify-between animate-pulse">
            {/* 标题和删除按钮区域 */}
            <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>

            {/* 描述区域 */}
            <div className="h-4 bg-gray-300 rounded w-full"></div>

            {/* 枪械代码区域 */}
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>

            {/* 用户信息和复制按钮区域 */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {/* 头像骨架 */}
                    <div className="w-6 h-6 bg-gray-300 rounded-full shrink-0"></div>
                    {/* 用户名骨架 */}
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
                {/* 复制按钮骨架 */}
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}

export function GunCodeGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-1 pb-3">
            {Array.from({ length: count }).map((_, index) => (
                <GunCodeSkeleton key={index} />
            ))}
        </div>
    );
}
