import {z} from "zod";
import {MediaType} from "@/generated/prisma/browser";


export const mediaSchema = z.object({
    url:z.url({message:"Invalid URL format"}),
    type:z.enum(MediaType,{message:"Invalid media type"}),
});

export type MediaSchema = z.infer<typeof mediaSchema>;
