import { verifyToken } from "@/features/auth/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requirePageAuth } from "@/features/auth/auth";

export default async function Home() {
    const user = await requirePageAuth();

    return (
        <div>
            <h1>Admin</h1>
        </div>
    );
}
