CREATE TABLE "timelines" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_date" date NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"bvid" varchar(20),
	"deleted_at" date
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT '{"accessory":"roundGlasses","body":"chest","circleColor":"blue","clothing":"tankTop","clothingColor":"black","eyebrows":"raised","eyes":"heart","facialHair":"mediumBeard","graphic":"gatsby","hair":"balding","hairColor":"orange","hat":"none5","hatColor":"red","lashes":true,"lipColor":"purple","mask":false,"faceMask":true,"mouth":"openSmile","skinTone":"red"}'::jsonb;