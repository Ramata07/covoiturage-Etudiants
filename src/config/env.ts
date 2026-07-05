//au lancement du serveur, c'est vce qui va s'éxécuter en premier, il va chercher les variables d'environnement et les valider
import { createEnv } from '@t3-oss/env-core';
import * as z from 'zod';


const serverEnv = createEnv({
    server: {
        PORT: z.coerce.number().default(8080), //le default est 8080 si la variable d'environnement n'est pas définie
        HOST: z.string().default("localhost"),
        DATABASE_URL: z.url(),
        NODE_ENV: z
        .enum(['development', 'production', 'test']).default('development'),
        RATE_LIMIT_MAX: z.coerce.number().default(3),
        RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
        JWT_SECRET: z.string().min(1),
    },

    runtimeEnv: {
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET,
    },
});

export default serverEnv;
