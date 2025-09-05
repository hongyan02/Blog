"use client";
import { useAuth } from "@/components/auth/AuthContext";
import { UserHeader } from "@/shared/layout/UserHeader";
export default function Page() {
    const { user, loading } = useAuth();
    return (
        <div>
            <header className="p-3">
                <UserHeader user={user} loading={loading} />
            </header>
        </div>
    );
}
