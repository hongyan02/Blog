import { ReactElement } from "react";

type Props = {
    date: string;
    title: string;
    content?: ReactElement | string;
    bvid?: string;
};
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
                {/* 渲染 Markdown 转换后的 HTML 内容 */}
                {typeof item.content === "string" ? (
                    <div
                        className="prose dark:prose-invert max-w-none text-lg"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                    />
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
