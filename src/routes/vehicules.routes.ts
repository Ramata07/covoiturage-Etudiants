import { Router, type Request, type Response } from "express";
import z from "zod";
import { eq } from "drizzle-orm";
import db from "@/db";
import { PublicVehicule, VehiculeTable } from "@/db/schema/vehicule/vehicules";
import { HttpError } from "@/errors/http-error";
import { authenticated } from "@/middlewares/authenticated";
import { validateRequest } from "@/middlewares/validate-request";
import { UsersTable } from "@/db/schema/auth-profiles/user";
import { ApiResponse, successResponse } from "@/utils/api-response";
import { generateUid } from "@/utils/generate_uid";

export const vehiculeRoutes = Router();

//Créer un véhicule

const createVehiculeSchema = z.object({
    immatriculation: z.string().min(2),
    nbre_places: z.number().int().min(1),
    modele: z.string().min(2),
    couleur: z.string().min(1),
    marque: z.string().min(1),
});

type CreateVehiculeBody = z.infer<typeof createVehiculeSchema>;

vehiculeRoutes.post(
    "/create",
    authenticated,
    validateRequest({ body: createVehiculeSchema }),
    async (
        req: Request<{}, {}, CreateVehiculeBody>,
        res: Response<ApiResponse<PublicVehicule>>,
    ) => {
        const { immatriculation, nbre_places, modele, couleur, marque } = req.body;
        const authId = req.auth?.id;

        if (!authId) {
            throw new HttpError(401, "Utilisateur non authentifié.");
        }

        const existingVehicule = await db.select()
            .from(VehiculeTable)
            .where(eq(VehiculeTable.proprio, authId));

        if (existingVehicule.length > 0) {
            throw new HttpError(400, "Vous avez déjà un véhicule enregistré.");
        }

        const id = generateUid("vh_");

        const [vehicule] = await db.insert(VehiculeTable)
            .values({ id, immatriculation, proprio: authId, nbre_places, modele, couleur, marque })
            .returning();

        await db.update(UsersTable).set({ role: "chauffeur" }).where(eq(UsersTable.id, authId));

        return res.status(201).json(successResponse(vehicule!));
    });

// Récupérer le véhicule de l'utilisateur authentifié

vehiculeRoutes.get(
    "/my-vehicule",
    authenticated,
    async(req: Request, res: Response<ApiResponse<PublicVehicule>>)=>{

    const authId = req.auth?.id;

    if (!authId) {
        throw new HttpError(401, "Utilisateur non authentifié.");
    }

    const vehicule = await db.select().from(VehiculeTable).where(eq(VehiculeTable.proprio, authId)).limit(1);

    if (vehicule.length === 0) {
        throw new HttpError(404, "Aucun véhicule trouvé pour cet utilisateur.");
    }

    res.json(successResponse(vehicule[0]!));


 }); 


// Mettre à jour le véhicule de l'utilisateur authentifié

const updateVehiculeSchema = z.object({
    modele: z.string().min(2),
    nbre_places: z.number().int().min(1),
    couleur: z.string().min(1),
    marque: z.string().min(1),
});  

type UpdateVehiculeBody = z.infer<typeof updateVehiculeSchema>;

vehiculeRoutes.put(
    "/update-vehicule",
    authenticated,
    validateRequest({ body: updateVehiculeSchema }),
    async (
        req: Request<{}, {}, UpdateVehiculeBody>,
        res: Response<ApiResponse<PublicVehicule>>
    ) => {
        const { modele, nbre_places, couleur, marque } = req.body;
        const authId = req.auth?.id;

        if (!authId) {
            throw new HttpError(401, "Utilisateur non authentifié.");
        }

        const existingVehicule = await db.select().from(VehiculeTable).where(eq(VehiculeTable.proprio, authId));

        if (existingVehicule.length === 0) {
            throw new HttpError(404, "Aucun véhicule trouvé pour cet utilisateur.");
        }

    const vehicule = await db.update(VehiculeTable)
        .set({ modele, nbre_places, couleur, marque })
        .where(eq(VehiculeTable.proprio, authId))
        .returning();

    res.json(successResponse(vehicule[0]!));
});

// Supprimer le véhicule de l'utilisateur authentifié

vehiculeRoutes.delete(
    "/delete-vehicule",
    authenticated,
    async (req: Request, res: Response<ApiResponse<PublicVehicule>>) => {

    const authId = req.auth?.id;

    if (!authId){
        throw new HttpError(401, "Utilisateur non authentifié.");
    }

    const existingVehicule = await db.select().from(VehiculeTable).where(eq(VehiculeTable.proprio, authId));

    if (existingVehicule.length === 0) {
        throw new HttpError(404, "Aucun véhicule trouvé pour cet utilisateur.");
    }

    const vehicule = await db.delete(VehiculeTable).where(eq(VehiculeTable.proprio, authId)).returning();

    await db.update(UsersTable)
    .set({ role: "client" })
    .where(eq(UsersTable.id, authId));

    res.json(successResponse(vehicule[0]!));
   
});

