import { db } from "@server/db/db";
import { eq } from "drizzle-orm";
import { users } from "@server/db/schema";
import { verifySessionToken } from "@/features/auth/session";
import type { User } from "@server/db/schema";

export const getUser = async (token: string | undefined): Promise<User | null> => {
    if (!token) return null;

    const session = await verifySessionToken(token);
    if (!session) return null;

    const [user] = await db.select().from(users).where(eq(users.id, session.userId));
    return user ?? null;
};
