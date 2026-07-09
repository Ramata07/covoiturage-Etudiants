CREATE TABLE "refresh_tokens" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"id_user" varchar(150) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"date_expiration" timestamp with time zone NOT NULL,
	"invalider_token" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_id_user_users_id_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;