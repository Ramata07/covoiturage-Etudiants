CREATE TABLE "vehicules" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"immatriculation" varchar(15) NOT NULL,
	"proprio" varchar(150) NOT NULL,
	"nbre_places" integer NOT NULL,
	"modele" varchar(100) NOT NULL,
	"couleur" varchar(100) NOT NULL,
	"marque" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trajets" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"id_conducteur" varchar(150),
	"id_vehicule" varchar(100),
	"destination" varchar(100) NOT NULL,
	"point_depart" varchar(100) NOT NULL,
	"prix" integer NOT NULL,
	"nbre_passagers" integer NOT NULL,
	"date_depart" date,
	"nbre_places_dispo" integer NOT NULL,
	"nbre_places_restants" integer NOT NULL,
	"statut" varchar(20) NOT NULL,
	"heure_depart" varchar(20) NOT NULL,
	"heure_arrivee" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"id_passager" varchar(150),
	"id_trajet" varchar(100),
	"dateReservation" date,
	"prix" integer NOT NULL,
	"method_paiement" varchar(50) NOT NULL,
	"commentaire" varchar(150) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "avis" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"id_passager" varchar(150),
	"id_trajet" varchar(100),
	"nbreEtoiles" integer,
	"commentaire" varchar(300) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "password" TO "mot_de_passe";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "photo" varchar(200);--> statement-breakpoint
ALTER TABLE "vehicules" ADD CONSTRAINT "vehicules_proprio_users_id_fk" FOREIGN KEY ("proprio") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "trajets" ADD CONSTRAINT "trajets_id_conducteur_users_id_fk" FOREIGN KEY ("id_conducteur") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trajets" ADD CONSTRAINT "trajets_id_vehicule_vehicules_id_fk" FOREIGN KEY ("id_vehicule") REFERENCES "public"."vehicules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_id_passager_users_id_fk" FOREIGN KEY ("id_passager") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_id_trajet_trajets_id_fk" FOREIGN KEY ("id_trajet") REFERENCES "public"."trajets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_passager_users_id_fk" FOREIGN KEY ("id_passager") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "avis" ADD CONSTRAINT "avis_id_trajet_trajets_id_fk" FOREIGN KEY ("id_trajet") REFERENCES "public"."trajets"("id") ON DELETE no action ON UPDATE no action;