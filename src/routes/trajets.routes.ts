import { Router, type Request, type Response } from "express";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { PublicTrajet, TrajetTable } from "@/db/schema/trajet/trajets";
import { VehiculeTable } from "@/db/schema/vehicule/vehicules";
import { HttpError } from "@/errors/http-error";
import { authenticated } from "@/middlewares/authenticated";
import { validateRequest } from "@/middlewares/validate-request";
import { UsersTable } from "@/db/schema/auth-profiles/user";
import { ApiResponse, successResponse } from "@/utils/api-response";
import { generateUid } from "@/utils/generate_uid";



export const trajetsRoutes = Router();

//Créer un trajet

const createTrajetSchema = z.object({
    destination: z.string().min(2),
    point_depart: z.string().min(2),
    prix: z.number().int().min(1),
    nbre_passagers: z.number().int().min(1),
    date_depart: z.coerce.date(),
    nbre_places_dispo: z.number().int().min(1),
    heure_depart: z.string().min(2),
    heure_arrivee: z.string().min(2),
    statut: z.string().min(2),
});

type CreateTrajetBody = z.infer<typeof createTrajetSchema>;

trajetsRoutes.post(
    "/create",
    authenticated,
    validateRequest({ body: createTrajetSchema }),
    async (
        req: Request<{}, {}, CreateTrajetBody>,
        res: Response<ApiResponse<PublicTrajet>>,
    ) => {
        const { destination, point_depart, prix, nbre_passagers, date_depart, nbre_places_dispo, heure_depart, heure_arrivee, statut } = req.body;

        const existingTrajet = await db.select()
            .from(TrajetTable)
            .where(eq(TrajetTable.id_conducteur, req.auth!.id));

        if (existingTrajet.length > 0) {
            throw new HttpError(400, "Vous avez déjà un trajet enregistré.");
        }

        const [vehicule] = await db.select().from(VehiculeTable).where(eq(VehiculeTable.proprio, req.auth!.id));

        if (!vehicule) {
            throw new HttpError(400, "Vous devez enregistrer un véhicule avant de créer un trajet.");
        }

        const id = generateUid("tr_");

        const [trajet] = await db.insert(TrajetTable)
            .values({ id, destination, point_depart, prix, nbre_passagers, date_depart: date_depart.toISOString().split("T")[0]!, nbre_places_dispo, nbre_places_restants: nbre_places_dispo, heure_depart, heure_arrivee, statut, id_conducteur: req.auth!.id, id_vehicule: vehicule.id })
            .returning();

        await db.update(UsersTable).set({ role: "chauffeur" }).where(eq(UsersTable.id, req.auth!.id));

        return res.status(201).json(successResponse(trajet!));
    });

// Récupérer le trajet de l'utilisateur authentifié

trajetsRoutes.get(
    "/my-trajet",
    authenticated,
    async(req: Request, res: Response<ApiResponse<PublicTrajet>>)=>{


    const trajet = await db.select().from(TrajetTable).where(eq(TrajetTable.id_conducteur, req.auth!.id)).limit(1);

    if (trajet.length === 0) {
        throw new HttpError(404, "Aucun trajet trouvé pour cet utilisateur.");
    }

    res.json(successResponse(trajet[0]!));


 }); 


// Mettre à jour le trajet de l'utilisateur authentifié

const updateTrajetSchema = z.object({
    destination: z.string().min(2),
    point_depart: z.string().min(2),
    prix: z.number().int().min(1),
    nbre_places_dispo: z.number().int().min(1),
    nbre_passagers: z.number().int().min(1),
    date_depart: z.coerce.date(),
    heure_depart: z.string().min(2),
    heure_arrivee: z.string().min(2),
    statut: z.string().min(2),
});  

type UpdateTrajetBody = z.infer<typeof updateTrajetSchema>;

trajetsRoutes.put(
    "/update-trajet",
    authenticated,
    validateRequest({ body: updateTrajetSchema }),
    async (
        req: Request<{}, {}, UpdateTrajetBody>,
        res: Response<ApiResponse<PublicTrajet>>
    ) => {
        const { destination, point_depart, prix, nbre_places_dispo, nbre_passagers, date_depart, heure_depart, heure_arrivee, statut } = req.body;
        

        const existingTrajet = await db.select().from(TrajetTable).where(eq(TrajetTable.id_conducteur, req.auth!.id));

        if (existingTrajet.length === 0) {
            throw new HttpError(404, "Aucun trajet trouvé pour cet utilisateur.");
        }

    const trajet = await db.update(TrajetTable)
        .set({ destination, point_depart, prix, nbre_places_dispo, nbre_passagers, date_depart: date_depart.toISOString().split("T")[0]!, heure_depart, heure_arrivee, statut })
        .where(eq(TrajetTable.id_conducteur, req.auth!.id))
        .returning();

    res.json(successResponse(trajet[0]!));
});

// Supprimer le véhicule de l'utilisateur authentifié

trajetsRoutes.delete(
    "/delete-trajet",
    authenticated,
    async (req: Request, res: Response<ApiResponse<PublicTrajet>>) => {


    const existingTrajet = await db.select().from(TrajetTable).where(eq(TrajetTable.id_conducteur, req.auth!.id));

    if (existingTrajet.length === 0) {
        throw new HttpError(404, "Aucun trajet trouvé pour cet utilisateur.");
    }

    const trajet = await db.delete(TrajetTable).where(eq(TrajetTable.id_conducteur, req.auth!.id)).returning();

    await db.update(UsersTable)
    .set({ role: "client" })
    .where(eq(UsersTable.id, req.auth!.id));

    res.json(successResponse(trajet[0]!));
   
});

