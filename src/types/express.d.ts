import type { PublicUser } from "@/db/schema/auth-profiles/user";
import type { AuthPayload } from "@/middlewares/authenticated";

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      user?: PublicUser;
    }
  }
}

export {};
