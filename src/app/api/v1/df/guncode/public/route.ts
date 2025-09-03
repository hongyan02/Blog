import { NextRequest, NextResponse } from "next/server";
import { db } from "@/features/db/db";
import { and, eq, isNull, desc } from "drizzle-orm";
import { weaponBuilds, users } from "@/features/db/schema";

export async function GET() {
    const rows = await db
        .select({
            id: weaponBuilds.id,
            weaponName: weaponBuilds.weaponName,
            gunCode: weaponBuilds.gunCode,
            description: weaponBuilds.description,
            createdAt: weaponBuilds.createdAt,
            username: users.username,
            avatar: users.avatar,
        })
        .from(weaponBuilds)
        .innerJoin(users, eq(users.id, weaponBuilds.ownerId))
        .where(and(eq(weaponBuilds.isPublic, true), isNull(weaponBuilds.deletedAt)))
        .orderBy(desc(weaponBuilds.createdAt));

    return NextResponse.json({ data: rows });
}
