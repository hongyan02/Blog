"use client";
import { useState } from "react";
import Image from "next/image";

export default function Map() {
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="p-4">
            <div className="flex justify-start ">
                <button
                    onClick={() => setShowMap(!showMap)}
                    className="bg-black hover:bg-gray-600 text-white font-medium text-lg px-6 py-3 rounded-md transition-colors"
                >
                    {showMap ? "隐藏地图" : "显示地图"}
                </button>
            </div>

            {showMap && (
                <div className="w-full border-2 border-black rounded-md p-4 mt-4 bg-white shadow-sm">
                    <div className="relative w-full">
                        <Image
                            src="/silksongMap.jpg"
                            alt="Silksong 世界地图"
                            width={1200}
                            height={800}
                            className="w-full h-auto rounded-md"
                            priority
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
