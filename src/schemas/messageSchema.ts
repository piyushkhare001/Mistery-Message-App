import { z} from "zod"

export const messageSchema = z.object({
    content :
     z.string()
     .min(6 , "message min lenth must be 6 charactar")
     .max(200 , "message max lenth must be 200 charactar")

    
})