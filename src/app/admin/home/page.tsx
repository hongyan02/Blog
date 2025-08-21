import { requirePageAuth } from "@/features/auth/auth";

export default async function Home() {
    await requirePageAuth();

    return (
        <div>
            <h1>Admin</h1>
        </div>
    );
}
