import CopyIcon from "@/shared/icons/Copy";

export default function ShowGunCode() {
    return (
        <div className="grid grid-cols-4 gap-4 p-3">
            {[...Array(10)].map((_, i) => (
                <div
                    key={i}
                    className="rounded-md border-2 border-gray-400/50 bg-white/30 backdrop-blur-md p-4 h-40 flex flex-col justify-between"
                >
                    <h2 className="text-lg font-bold">AM17紧凑突击步枪 {i + 1}</h2>
                    <p className="text-sm">6GN0M6804S63NUU4LC5D6</p>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                            <span className="text-sm">用户名</span>
                        </div>
                        <button className="p-1 rounded-md transition-transform transform hover:scale-125 hover:text-blue-500">
                            <CopyIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
