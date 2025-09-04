ALTER TABLE "invites" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "expires_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "invites" ALTER COLUMN "expires_at" SET DEFAULT (now() + interval '3 days');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "avatar" SET DEFAULT '{"accessory":"roundGlasses","body":"chest","circleColor":"blue","clothing":"dress","clothingColor":"white","eyebrows":"leftLowered","eyes":"simple","facialHair":"stubble","graphic":"react","hair":"bun","hairColor":"pink","hat":"beanie","hatColor":"black","lashes":true,"lipColor":"turqoise","mask":false,"faceMask":true,"mouth":"serious","skinTone":"yellow"}'::jsonb;