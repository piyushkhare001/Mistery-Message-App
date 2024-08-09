import dbConnected from "@/lib/dbConnect"
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendEmail"
import User from "@/model/User"


export async function POST(request:Request) {
  await  dbConnected()
    try{
        const {username , email , password} = await request.json()
 

        const existingVerifiedUserByUsername  = await User.findOne({
          username,
          isVerified: true,
        });
        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                  success: false,
                  message: 'Username is already taken',
                },
                { status: 400 }
              );
        }

        const existingUserByEmail  = await User.findOne({email})
        

        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
       console.log(verifyCode)
        if (existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                      success: false,
                      message: 'User already exists with this email',
                    },
                    { status: 400 }
                  );
            }else{
                const hashedPassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry =new Date(Date.now() + 3600000);
                await existingUserByEmail.save()

            }
        }else{
            const hashedPassword = await bcrypt.hash(password , 10)
            const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

          const newUser  = new User({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: [],
          })
          await newUser.save()
        }
      

        const emailResponse = await sendVerificationEmail(
      email , username , verifyCode

        )
        if (!emailResponse.success) {
            return Response.json(
              {
                success: false,
                message: emailResponse.message,
              },
              { status: 500 }
            );
          }
      
          return Response.json(
            {
              success: true,
              message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
          );
   

        return  Response.json({ success: true, message: 'sign up sucessfull' });
    }catch(error :any){
       console.log(error , " sign up failed")
       return  Response.json( { success: false, message: 'sign up failed' });
    }
    
}