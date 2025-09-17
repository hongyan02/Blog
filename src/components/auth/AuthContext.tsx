"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { BeanHeadProps } from "../avatar";

export interface UserCookieData {
    id: string;
    username: string;
    avatar: BeanHeadProps;
    role: number;
}

interface AuthContextType {
    user: UserCookieData | null;
    loading: boolean;
    login: (userData: UserCookieData) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserCookieData | null>(null);
    const [loading, setLoading] = useState(true);

    // 只保留cookie读取方法
    const getUserFromCookie = useCallback((): UserCookieData | null => {
        if (typeof window === "undefined") return null;

        try {
            const cookieValue = document.cookie
                .split("; ")
                .find((row) => row.startsWith("user_info="))
                ?.split("=")[1];

            if (!cookieValue) return null;

            const decodedValue = decodeURIComponent(cookieValue);
            const userData: UserCookieData = JSON.parse(decodedValue);

            if (!userData.id || !userData.username) {
                return null;
            }

            return userData;
        } catch (error) {
            console.warn("解析用户cookie失败:", error);
            return null;
        }
    }, []);

    // 初始化用户状态
    useEffect(() => {
        const initUser = async () => {
            const cookieUser = getUserFromCookie();

            if (cookieUser) {
                setUser(cookieUser);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/auth/me");
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

        initUser();
    }, [getUserFromCookie]);

    // 登录 - 直接设置用户信息，cookie由API处理
    const login = useCallback((userData: UserCookieData) => {
        setUser(userData);
    }, []);

    // 登出 - 只清除本地状态，cookie由API处理
    const logout = useCallback(async () => {
        setUser(null);

        try {
            await fetch("/api/auth/logout", { method: "POST" });
            // 刷新页面以确保认证状态被正确清除
            window.location.reload();
        } catch {
            // 即使API调用失败，也刷新页面以清除本地状态
            window.location.reload();
        }
    }, []);

    // 刷新用户信息
    const refreshUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
