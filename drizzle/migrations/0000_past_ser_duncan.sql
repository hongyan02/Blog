CREATE TABLE "invites" (
	"code" char(16) PRIMARY KEY NOT NULL,
	"used" boolean DEFAULT false,
	"used_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(32) NOT NULL,
	"password" char(60) NOT NULL,
	"invite_code" char(16),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_invite_code_invites_code_fk" FOREIGN KEY ("invite_code") REFERENCES "public"."invites"("code") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_invites_available" ON "invites" USING btree ("code");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");