import { logger } from '@/lib/logger';
import { z, type ZodSchema } from 'zod';
import { ERROR_CODES } from './errors';

/**
 * Generic validation function that can be used with any Zod schema
 *
 * @param schema The Zod schema to validate against
 * @param values The values to validate
 * @param errorMessage Custom error message (defaults to "Invalid data")
 * @param fnName Name of the function for logging
 * @returns Validated data (or throws an error)
 */
export const validateSchema = <T extends ZodSchema>({
  errorMessage = ERROR_CODES.INVALID_FIELDS,
  fnName,
  schema,
  values,
}: {
  errorMessage?: string;
  fnName: string;
  schema: T;
  values: unknown;
}): z.infer<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error, success } = schema.safeParse(values);

  if (!success) {
    if (fnName) {
      logger.debug(
        '%s (invalid_data): values=%o, issues=%o',
        fnName,
        values,
        error.flatten().fieldErrors,
      );
    }
    throw new Error(errorMessage);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data;
};
