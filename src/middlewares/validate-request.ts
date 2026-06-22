import { HttpError } from "@/errors/http-error";
import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { z } from "zod";

type RequestSchemas = {
  body?: z.ZodType;
  params?: z.ZodType;
  query?: z.ZodType;
};

export const validateRequest =
  (schemas: RequestSchemas): RequestHandler =>
  (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params) as ParamsDictionary;
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query) as ParsedQs;
      }

      next();
    } catch (error) {
      if (isZodError(error)) {
        const [issue] = error.issues;
        next(new HttpError(400, issue?.message ?? "Invalid request"));
        return;
      }

      next(error);
    }
  };

const isZodError = (error: unknown): error is z.ZodError =>
  typeof error === "object" &&
  error !== null &&
  "issues" in error &&
  Array.isArray((error as z.ZodError).issues);
