import {number, z} from "zod"

export const verifySchema = z.object({
    code : z.string(). length(6 , "code lenght must be 6 only")
})