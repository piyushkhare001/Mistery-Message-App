
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnected from "@/lib/dbConnect"
import UserModel from "@/model/User"
import { Session } from "inspector"
import { any } from "zod"
import { acceptMessageSchema } from '../../../../schemas/acceptMessageSchema';



 const authOptions  = NextAuth({
    providers:[
       Credentials({
        credentials: {
            username : {label : "EMAIL" , type : "text"},
            password : {label : "PASSWORD" , type : "password"}
        },

        async authorize (credentials : any): Promise<any> {
             dbConnected()
             try{
           const user =  await UserModel.findOne({
                $or : [
                    {username : credentials.identifier},
                    {email : credentials.identifier}
                ]
            })

            if(!user){
                throw new Error ("user not found with this email")
            }
            if (!user.isVerified){
                throw new Error("please verify user ")
            }
           else{


           const IsPasswordCorrect =  await bcrypt.compare(credentials.password , user.password)

           if(IsPasswordCorrect){
            return user;
           }
           else{
            throw new Error("incorret password")
           }
           }
             }catch(err :any) {
                throw new Error (err)
             }
        }
       })
    ]
    ,
    pages:{
        signIn : "/sign-in"
    },
   secret : process.env.NEXT_AUTH_SECRET,
   callbacks: {
    async jwt({token , user}){
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.isAcceptingMessage = user.isAcceptingMessages
            token.username = user.username
        }
        return token
    }, 
    async session({token , session}){
        if(token){
            session.user._id  = token._id
            session.user.isVerified  = token.isVerified
            session.user.isAcceptingMessage = token.isAcceptingMessage
            session.user.username= token.username

        }
        return session
    }
 
   }
})

export default NextAuth