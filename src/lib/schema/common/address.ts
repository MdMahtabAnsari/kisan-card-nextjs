import {z} from "zod";


export const addressSchema = z.object({
    addressLine:z.string().min(3,"Address line must be at least 3 characters long").max(255,"Address line must be less than 255 characters long").regex(/^[a-zA-Z0-9\s,'-]*$/,"Address line can only contain letters, numbers, spaces, commas, apostrophes and hyphens"),
    city:z.string().min(2,"City must be at least 2 characters long").max(100,"City must be less than 100 characters long").regex(/^[a-zA-Z\s'-]*$/,"City can only contain letters, spaces, apostrophes and hyphens"),
    state:z.string().min(2,"State must be at least 2 characters long").max(100,"State must be less than 100 characters long").regex(/^[a-zA-Z\s'-]*$/,"State can only contain letters, spaces, apostrophes and hyphens"),
    postalCode:z.string().min(4,"Postal code must be at least 4 characters long").max(20,"Postal code must be less than 20 characters long").regex(/^[a-zA-Z0-9\s-]*$/,"Postal code can only contain letters, numbers, spaces and hyphens"),
    country:z.string().min(2,"Country must be at least 2 characters long").max(100,"Country must be less than 100 characters long").regex(/^[a-zA-Z\s'-]*$/,"Country can only contain letters, spaces, apostrophes and hyphens"),
});

export type AddressSchema = z.infer<typeof addressSchema>;