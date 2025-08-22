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
ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT '{"accessory":"none","body":"breasts","circleColor":"blue","clothing":"dressShirt","clothingColor":"white","eyebrows":"concerned","eyes":"normal","facialHair":"mediumBeard","graphic":"gatsby","hair":"balding","hairColor":"black","hat":"none","hatColor":"black","lashes":false,"lipColor":"green","mask":false,"faceMask":true,"mouth":"lips","skinTone":"yellow"}'::jsonb;--> statement-breakpoint
ALTER TABLE "weapon_builds" ADD CONSTRAINT "weapon_builds_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_weapon_builds_public" ON "weapon_builds" USING btree ("is_public","deleted_at");--> statement-breakpoint
CREATE INDEX "idx_weapon_builds_owner" ON "weapon_builds" USING btree ("owner_id");