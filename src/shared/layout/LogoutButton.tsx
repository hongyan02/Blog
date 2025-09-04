"use client";
import { useAuth } from "@/components/auth/AuthContext";
import ExitIcon from "@/shared/icons/Exit";

export function LogoutButton() {
    const { logout } = useAuth();

    const handleLogout = async () => {
        logout();
    };

    return (
        <span
            className="cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 p-2 rounded-full hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
        >
            <ExitIcon />
        </span>
    );
}
