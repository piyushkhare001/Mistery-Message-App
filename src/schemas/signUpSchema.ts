import {z} from "zod"

export const usernameValidation = z
  .string()
  .min(4 , "Minnnimum username lenth must be 4 ")
  .max(20 , "maximum username lenth must be 20 ")
  .regex(/^[a-zA-Z0-9_]{3,16}$/ , "username must not contain special CHARACTORS")

  export const signUpSchema = z.object({
       username : usernameValidation,
       email : z.string().email({message : "enter valid email address"}),
       password : z.string().min( 6 , "password lenth must be 6").max(20 , "password lenth cannot more than  20")
  })