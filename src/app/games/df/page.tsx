"use client";
import { usePublicGunCodeQuery } from "@/queries/df/public/guncode";
import { GunCodeCard, GunCodeData } from "@/components/df/GunCodeCard";
import { GunCodeGridSkeleton } from "@/components/df/GunCodeSkeleton";
import { useAuth } from "@/components/auth/AuthContext";
import { UserHeader } from "@/shared/layout/UserHeader";
import { Suspense } from "react";

export default function DFPapge() {
    const { data, isLoading, error } = usePublicGunCodeQuery();
    const { user, loading } = useAuth();

    if (error) return <p>抛瓦不见了：{error.message}</p>;

    return (
        <div>
            <header className="text-2xl font-medium text-black p-3">
                <UserHeader user={user} loading={loading} />
                <div className="py-3">共享抛瓦～</div>
            </header>
            <main>
                <Suspense fallback={<GunCodeGridSkeleton count={1} />}>
                    {isLoading ? (
                        <GunCodeGridSkeleton count={1} />
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-1 pb-3">
                            {data?.data?.map((item: GunCodeData) => (
                                <GunCodeCard key={item.id} data={item} />
                            ))}
                        </div>
                    )}
                </Suspense>
            </main>
        </div>
    );
}
