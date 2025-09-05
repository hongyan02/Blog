import { getCosFiles } from "@/shared/cos";
import Image from "next/image";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
    const files = await getCosFiles("wallpaper/");
    const bucketUrl = "https://pic.agcl.ink";

    return (
        <main className="grid-background min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-black mb-6">图片墙</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {files.map((file) => {
                    // 预览页地址：/wallpaper/[filename]
                    const filename = file.Key.split("/").pop() ?? "";
                    const imgSrc = `${bucketUrl}/${file.Key}`;

                    return (
                        <Link
                            key={file.Key}
                            href={`${bucketUrl}/${file.Key}`}
                            target="_blank"
                            className="bg-white border-2 border-black/30 rounded-lg shadow-md overflow-hidden block"
                        >
                            <AspectRatio ratio={16 / 9}>
                                <Image
                                    src={imgSrc}
                                    alt={filename}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </AspectRatio>
                            {/* <p className="text-sm font-medium text-black p-3 truncate">
                                {filename}
                            </p> */}
                        </Link>
                    );
                })}
            </div>
        </main>
    );
}
