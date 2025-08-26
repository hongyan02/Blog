import React from "react";

interface BilibiliPlayerProps {
    aid?: number;
    cid?: number;
    bvid?: string;
    seasonId?: number;
    episodeId?: number;

    poster?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    danmaku?: boolean;
    refer?: boolean;

    t?: number;
    kind?: number;
    p?: number;

    width?: string | number;
    height?: string | number;
}

const BilibiliPlayer: React.FC<BilibiliPlayerProps> = ({
    aid,
    cid,
    bvid,
    seasonId,
    episodeId,
    poster,
    autoplay,
    muted,
    danmaku,
    refer,
    t,
    kind,
    p,
    width = "800px",
    height = "450px",
}) => {
    // 拼接 query 参数
    const params = new URLSearchParams();

    if (aid) params.set("aid", String(aid));
    if (cid) params.set("cid", String(cid));
    if (bvid) params.set("bvid", bvid);
    if (seasonId) params.set("seasonId", String(seasonId));
    if (episodeId) params.set("episodeId", String(episodeId));

    // boolean 类型 → 转成 0 / 1
    if (poster !== undefined) params.set("poster", poster ? "1" : "0");
    if (autoplay !== undefined) params.set("autoplay", autoplay ? "1" : "0");
    if (muted !== undefined) params.set("muted", muted ? "1" : "0");
    if (danmaku !== undefined) params.set("danmaku", danmaku ? "1" : "0");
    if (refer !== undefined) params.set("refer", refer ? "1" : "0");

    if (t !== undefined) params.set("t", String(t));
    if (kind !== undefined) params.set("kind", String(kind));
    if (p !== undefined) params.set("p", String(p));

    const src = `https://player.bilibili.com/player.html?${params.toString()}`;

    return <iframe src={src} allowFullScreen style={{ width, height }}></iframe>;
};

export default BilibiliPlayer;
