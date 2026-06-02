import {z} from 'zod';

export const dayEnum = z.enum(['1','7','30','90','180','365','ALL']);

export type DayEnum = z.infer<typeof dayEnum>;