import { pgTable, index, jsonb } from "drizzle-orm/pg-core";
import randomBeanHead, { BeanHeadProps } from "@/components/avatar";
import { InferSelectModel, sql } from "drizzle-orm";
export type Invite = InferSelectModel<typeof invites>;
export type WeaponBuild = InferSelectModel<typeof weaponBuilds>;
export type User = InferSelectModel<typeof users>;
export type Timeline = InferSelectModel<typeof timelines>;
/* ========== 邀请码表 ========== */
export const invites = pgTable(
    "invites",
    (t) => ({
        // 16 位 Base58 随机邀请码，主键
        code: t.char("code", { length: 16 }).primaryKey(),
        //创建人
        creator: t.uuid("creator"),
        // 是否已被使用：true=已使用，false=未使用
        used: t.boolean("used").default(false),
        // 使用此邀请码注册成功的用户 id（外键到 users.id）
        usedBy: t.uuid("used_by"),
        // 邀请码生成时间
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        // 邀请码过期时间，过期后不可再用于注册
        // expiresAt: t.timestamp("expires_at").notNull(),
        expiresAt: t
            .timestamp("expires_at")
            .default(sql`(now() + interval '3 days')`)
            .notNull(),
    }),
    (table) => [
        // 辅助索引，便于快速查询「可用」邀请码
        index("idx_invites_available").on(table.code),
    ]
);

/* ========== 用户表 ========== */
export const users = pgTable(
    "users",
    (t) => ({
        // 用户唯一 id，自动生成 UUID
        id: t.uuid("id").defaultRandom().primaryKey(),
        // 用户名，全局唯一，不超过 32 字符
        username: t.varchar("username", { length: 32 }).notNull().unique(),
        // 密码的 bcrypt 哈希，固定 60 字符
        password: t.char("password", { length: 60 }).notNull(),
        // 注册时使用的邀请码（外键到 invites.code）
        inviteCode: t
            .char("invite_code", { length: 16 })
            .references(() => invites.code, { onDelete: "set null" }),
        // 账号创建时间
        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        // 账号状态：0 正常，1 冻结，2 注销
        status: t.smallint("status").default(0).notNull(),
        // 账号角色：0 普通用户，1 管理员
        role: t.smallint("role").default(0).notNull(),
        //beanhead头像生成
        avatar: jsonb("avatar")
            .notNull()
            .default(randomBeanHead()) // ← 直接当默认值
            .$type<BeanHeadProps>(),
    }),
    (table) => [
        // 按 status 建索引，方便快速查询正常/冻结/注销用户
        index("idx_users_status").on(table.status),
    ]
);

/* ========== 游戏-三角洲行动-改枪码表 ========== */
export const weaponBuilds = pgTable(
    "weapon_builds",
    (t) => ({
        id: t.uuid("id").defaultRandom().primaryKey(),

        ownerId: t
            .uuid("owner_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),

        weaponName: t.varchar("weapon_name", { length: 64 }).notNull(),

        gunCode: t.text("gun_code").notNull(),

        description: t.text("description").notNull(),

        isPublic: t.boolean("is_public").default(false).notNull(),

        deletedAt: t.timestamp("deleted_at"),

        createdAt: t.timestamp("created_at").defaultNow().notNull(),
        updatedAt: t.timestamp("updated_at").defaultNow().notNull(),
    }),
    (table) => [
        index("idx_weapon_builds_public").on(table.isPublic, table.deletedAt),
        index("idx_weapon_builds_owner").on(table.ownerId),
    ]
);

/* ========== 时间轴表 ========== */
export const timelines = pgTable("timelines", (t) => ({
    // 事件唯一ID
    id: t.uuid("id").defaultRandom().primaryKey(),

    // 事件发生日期（显示在时间轴上的日期）
    eventDate: t.date("event_date").notNull(),

    // 事件标题
    title: t.varchar("title", { length: 100 }).notNull(),

    // 事件内容描述（支持Markdown格式）
    content: t.text("content").notNull(),

    //bvid
    bvid: t.varchar("bvid", { length: 20 }),

    //删除时间
    deletedAt: t.date("deleted_at"),
}));
