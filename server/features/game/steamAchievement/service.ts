import got from "got";

interface SteamSchemaResp {
    game: {
        availableGameStats: {
            achievements: SchemaAchievement[];
        };
    };
}

interface SchemaAchievement {
    name: string; // 成就内部名
    displayName: string; // 中文名
    description: string;
    icon: string; // 彩色
    icongray: string; // 灰色
    hidden: 0 | 1;
}

interface PlayerResp {
    playerstats: {
        achievements: PlayerAchievement[];
    };
}

interface PlayerAchievement {
    apiname: string; // 对应 schema.name
    achieved: 0 | 1;
    unlocktime: number;
}

/* 给前端/调用方的干净结构 */
export interface AchievementResult {
    name: string; // 内部名，可做 key
    displayName: string;
    description: string;
    icon: string; // 根据是否达成自动选彩色/灰色
    achieved: 0 | 1;
    unlockTime?: number; // 未达成时为 undefined
}

export interface AchievementSummary {
    achievements: AchievementResult[];
    total: number;
    unlocked: number;
}

export async function steamAchievementService(
    key: string,
    appid: number,
    steamid: number,
    l = "schinese"
): Promise<AchievementSummary> {
    // 并行拉取两份数据，更快
    const [schema, player] = await Promise.all([
        got<SteamSchemaResp>("https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2", {
            searchParams: { key, appid, l },
            responseType: "json",
            throwHttpErrors: false,
        }),
        got<PlayerResp>("https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1", {
            searchParams: { key, appid, steamid, l },
            responseType: "json",
            throwHttpErrors: false,
        }),
    ]);
    console.log(schema.url);
    console.log(player.url);

    // 把玩家成就做成 Map，方便 O(1) 查找
    const playerMap = new Map(player.body.playerstats.achievements.map((a) => [a.apiname, a]));

    // 合并
    const achievements = schema.body.game.availableGameStats.achievements.map(
        (def): AchievementResult => {
            const pa = playerMap.get(def.name);
            return {
                name: def.name,
                displayName: def.displayName,
                description: def.description,
                icon: pa?.achieved ? def.icon : def.icongray, // 自动选图标
                achieved: pa?.achieved ?? 0,
                unlockTime: pa?.achieved ? pa.unlocktime : undefined,
            };
        }
    );

    const unlocked = achievements.filter((a) => a.achieved === 1).length;
    const total = achievements.length;

    return {
        achievements,
        total,
        unlocked,
    };
}
