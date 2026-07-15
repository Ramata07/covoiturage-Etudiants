CREATE TABLE "otps" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"id_user" varchar(150) NOT NULL,
	"code_hash" varchar(64) NOT NULL,
	"date_expiration" timestamp with time zone NOT NULL,
	"utilise" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_verifie" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "otps" ADD CONSTRAINT "otps_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;