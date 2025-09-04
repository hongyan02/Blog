CREATE TABLE "invites" (
	"code" char(16) PRIMARY KEY NOT NULL,
	"creator" uuid,
	"used" boolean DEFAULT false,
	"used_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp DEFAULT (now() + interval '3 days') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"secret_hash" text NOT NULL,
	"last_verified_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_date" date NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"bvid" varchar(20),
	"deleted_at" date
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(32) NOT NULL,
	"password" char(60) NOT NULL,
	"invite_code" char(16),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	"role" smallint DEFAULT 0 NOT NULL,
	"avatar" jsonb DEFAULT '{"accessory":"none","body":"chest","circleColor":"blue","clothing":"dressShirt","clothingColor":"black","eyebrows":"serious","eyes":"squint","facialHair":"none2","graphic":"none","hair":"balding","hairColor":"blue","hat":"none","hatColor":"black","lashes":false,"lipColor":"red","mask":false,"faceMask":false,"mouth":"sad","skinTone":"black"}'::jsonb NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "weapon_builds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"weapon_name" varchar(64) NOT NULL,
	"gun_code" text NOT NULL,
	"description" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_invite_code_invites_code_fk" FOREIGN KEY ("invite_code") REFERENCES "public"."invites"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weapon_builds" ADD CONSTRAINT "weapon_builds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_invites_available" ON "invites" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_weapon_builds_public" ON "weapon_builds" USING btree ("is_public","deleted_at");--> statement-breakpoint
CREATE INDEX "idx_weapon_builds_owner" ON "weapon_builds" USING btree ("owner_id");