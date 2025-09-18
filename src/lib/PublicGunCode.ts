import { db } from "@server/db/db";
import { weaponBuilds, users } from "@server/db/schema";
import type { WeaponBuild } from "@server/db/schema";
import { BeanHeadProps } from "@/components/avatar";
import { and, eq, isNull, desc } from "drizzle-orm";

export type PublicGunCode = WeaponBuild & {
    username: string;
    avatar: BeanHeadProps;
};
export async function getPublicGunCodes(): Promise<PublicGunCode[]> {
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

    return rows as PublicGunCode[];
}
