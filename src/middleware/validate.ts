// src/middleware/validate.ts
import type { NextFunction, Request, Response } from 'express';
import { flattenError, type ZodType } from 'zod';

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: 'Validation error',
        details: flattenError(result.error),
      });
    }

    req.body = result.data;
    next();
  };
};
