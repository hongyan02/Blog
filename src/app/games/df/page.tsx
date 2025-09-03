"use client";
import { usePublicGunCodeQuery } from "@/queries/df/public/guncode";
import { GunCodeCard, GunCodeData } from "@/components/DF/GunCodeCard";

export default function DF() {
    const { data, isLoading, error } = usePublicGunCodeQuery();

    if (isLoading) return <p>耐心等待...</p>;
    if (error) return <p>抛瓦不见了：{error.message}</p>;
    return (
        <div>
            <header className="text-2xl font-medium text-black p-3">共享抛瓦～</header>
            <main>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-1 pb-3">
                    {data?.data?.map((item: GunCodeData) => (
                        <GunCodeCard key={item.id} data={item} />
                    ))}
                </div>
            </main>
        </div>
    );
}
