import { BeanHead } from "beanheads";
import Link from "next/link";
import { UserCookieData } from "@/components/auth/AuthContext";
import { LogoutButton } from "./LogoutButton";

interface UserHeaderProps {
    user: UserCookieData | null;
    loading?: boolean;
}

export function UserHeader({ user, loading = false }: UserHeaderProps) {
    if (loading) {
        return (
            <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center w-full space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
        );
    }

    return user ? (
        <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center w-full space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-white hover:ring-blue-200 transition-all duration-300 hover:scale-105">
                    <Link href="/games/profile">
                        <BeanHead {...user.avatar} />
                    </Link>
                </div>
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {user.username}
                </span>
            </div>
            <LogoutButton />
        </div>
    ) : (
        <div className="w-full h-20 p-4 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-md ring-2 ring-white hover:ring-blue-200 transition-all duration-300 hover:scale-105">
                <BeanHead
                    accessory="none"
                    body="chest"
                    circleColor="blue"
                    clothing="naked"
                    clothingColor="white"
                    eyebrows="serious"
                    eyes="dizzy"
                    faceMask={false}
                    faceMaskColor="green"
                    facialHair="none3"
                    graphic="gatsby"
                    hair="none"
                    hairColor="pink"
                    hat="none5"
                    hatColor="black"
                    lashes={false}
                    lipColor="pink"
                    mask
                    mouth="openSmile"
                    skinTone="red"
                />
            </div>
            <div className="flex items-center">
                <Link
                    href="/auth/login"
                    className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                    登录
                </Link>
            </div>
        </div>
    );
}
