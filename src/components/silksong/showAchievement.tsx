import got from "got";
import Image from "next/image";
import { AchievementSummary } from "@server/features/game/steamAchievement/service";

interface ShowAchievementProps {
    steamkey: string;
    appid: number;
    steamid: number;
    l?: string;
}

async function getSteamAchievements(
    steamkey: string,
    appid: number,
    steamid: number,
    l: string = "schinese"
) {
    try {
        const response = await got(
            `http://localhost:3000/api/game/steamAchievement?key=${steamkey}&appid=${appid}&steamid=${steamid}&l=${l}`,
            {
                responseType: "json",
            }
        );
        const data = response.body as AchievementSummary;
        return data;
    } catch (error) {
        console.error("获取 Steam 成就失败:", error);
        return { achievements: [], total: 0, unlocked: 0 };
    }
}

export default async function ShowAchievement({
    steamkey,
    appid,
    steamid,
    l = "schinese",
}: ShowAchievementProps) {
    const achievements = await getSteamAchievements(steamkey, appid, steamid, l);

    if (!achievements || achievements.achievements.length === 0) {
        return (
            <div className="p-3">
                <div className="text-center py-8">
                    <p className="text-xl text-gray-600 dark:text-gray-400">暂无成就数据</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3">
            <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 p-4 pt-0">
                    已解锁 {achievements.unlocked} / {achievements.total} 个成就
                </p>
            </div>

            {/* 横向滚动容器 */}
            <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max">
                    {achievements.achievements.map((ach) => (
                        <div
                            key={ach.name}
                            className="flex-shrink-0 w-64 border-2 border-black rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <Image
                                    src={ach.icon}
                                    alt={ach.displayName}
                                    width={64}
                                    height={64}
                                    className="rounded-md"
                                />
                                <h3 className="text-lg font-medium text-black">
                                    {ach.displayName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {ach.description && ach.description.trim() !== ""
                                        ? ach.description
                                        : "暂无描述"}
                                </p>
                                <span
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                        ach.achieved
                                            ? "bg-black text-white"
                                            : "bg-gray-200 text-gray-800 border-2 border-gray-300"
                                    }`}
                                >
                                    {ach.achieved ? "已解锁" : "未解锁"}
                                </span>
                                {ach.unlockTime && (
                                    <p className="text-xs text-gray-500">
                                        解锁时间:{" "}
                                        {new Date(ach.unlockTime * 1000).toLocaleDateString(
                                            "zh-CN"
                                        )}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 滚动提示 */}
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">← 滑动查看更多成就 →</p>
            </div>
        </div>
    );
}
