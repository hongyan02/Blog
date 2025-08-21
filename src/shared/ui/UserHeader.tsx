"use client";
import { BeanHead } from "beanheads";
import { useAuth } from "@/features/auth/components/AuthContext";
import Link from "next/link";
import ExitIcon from "../icons/Exit";

export function UserHeader() {
    const { user, loading, logout } = useAuth();

    //加载用户数据
    if (loading) {
        return (
            <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-gray-300" />
                <div className="w-32 h-6 bg-gray-300 rounded-md" />
            </div>
        );
    }

    return user ? (
        <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center w-full space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-white hover:ring-blue-200 transition-all duration-300 hover:scale-105">
                    <BeanHead
                        accessory="roundGlasses"
                        body="chest"
                        clothing="tankTop"
                        clothingColor="blue"
                        eyes="wink"
                        hair="short"
                        hairColor="black"
                        mouth="openSmile"
                        skinTone="brown"
                    />
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {user?.username}
                </span>
            </div>
            <span
                className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 p-2 rounded-full hover:bg-red-50 hover:text-red-600"
                onClick={logout}
            >
                <ExitIcon />
            </span>
        </div>
    ) : (
        <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-white hover:ring-blue-200 transition-all duration-300 hover:scale-105">
                <BeanHead
                    body="chest"
                    clothing="dressShirt"
                    clothingColor="blue"
                    eyes="happy"
                    eyebrows="raised"
                    hair="short"
                    hairColor="brown"
                    mouth="openSmile"
                    skinTone="light"
                    mask={true}
                    faceMask={false}
                    graphic="none"
                    facialHair="none"
                    accessory="roundGlasses"
                    hat="none"
                    lashes={false}
                />
            </div>
            <div className="flex items-center">
                <Link
                    href="/games/login"
                    className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                    登录
                </Link>
            </div>
        </div>
    );
}
