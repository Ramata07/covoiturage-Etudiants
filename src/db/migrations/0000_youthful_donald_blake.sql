CREATE TYPE "public"."role" AS ENUM('passager', 'conducteur');--> statement-breakpoint
CREATE TYPE "public"."statut" AS ENUM('prevu', 'en_cours', 'termine', 'annule');--> statement-breakpoint
CREATE TYPE "public"."userRoles" AS ENUM('admin', 'client', 'chauffeur');--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(150) PRIMARY KEY NOT NULL,
	"nom" varchar(200) NOT NULL,
	"prenom" varchar(150) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(150) NOT NULL,
	"role" "userRoles" DEFAULT 'client' NOT NULL,
	"created_at" timestamp NOT NULL,
	"update_at" timestamp NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
