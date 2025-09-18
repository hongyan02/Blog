import ShowAchievement from "@/components/silksong/showAchievement";
import Map from "@/components/silksong/Map";
import MapSkeleton from "@/components/silksong/MapSkeleton";
import { Suspense } from "react";

export default function SilkSongPage() {
    return (
        <>
            <h1 className="text-4xl font-extrabold p-4">空洞骑士:丝之歌</h1>
            <Suspense fallback={<MapSkeleton />}>
                <Map />
            </Suspense>
            <ShowAchievement
                steamkey={String(process.env.STEAM_APP_KEY!)}
                appid={Number(process.env.SILK_SONG_APP_ID!)}
                steamid={Number(process.env.STEAM_ID!)}
            />
        </>
    );
}
