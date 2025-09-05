"use client";
import { useState } from "react";
import { useGunCodeQuery } from "@/queries/df/guncode";
import { GunCodeCard, GunCodeData } from "@/components/DF/GunCodeCard";
import AddGunCodeForm from "@/components/DF/AddCodeForm";
import { UserHeader } from "@/shared/layout/UserHeader";
import { useAuth } from "@/components/auth/AuthContext";

export default function Store() {
    const { data, isLoading, error } = useGunCodeQuery();
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    if (isLoading) return <p>寻找抛瓦中...</p>;
    if (error) return <p>抛瓦不见了：{error.message}</p>;

    return (
        <div className="w-full flex items-center justify-center">
            <div className="border-2 border-black/50 m-3 w-full rounded-md">
                <UserHeader user={user} />
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl font-medium text-black p-3">我的抛瓦！！</h1>
                    <button
                        onClick={() => setShowForm(true)}
                        className="font-medium text-black p-3 hover:bg-gray-300/50 rounded-full"
                    >
                        添加
                    </button>
                </div>

                {/* 弹窗/抽屉 */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-md p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">新增改枪码</h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-gray-500 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                            <AddGunCodeForm onClose={() => setShowForm(false)} />
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 px-1 pb-3">
                    {data?.data?.map((item: GunCodeData) => (
                        <GunCodeCard key={item.id} data={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
