"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { users } from "@/features/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useRouter } from "next/navigation";

export type User = Pick<InferSelectModel<typeof users>, "id" | "username" | "role" | "avatar">;

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    // 页面刷新时自动获取用户信息
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/v1/me"); // cookie 会自动带上
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // 前端登录时手动设置 user
    const login = (userData: User) => {
        setUser(userData);
    };

    // 前端登出
    const logout = async () => {
        setUser(null);
        const res = await fetch("/api/v1/logout", { method: "POST" }); // 清 cookie
        if (res.ok) {
            // 登出成功
            router.push("/games");
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
