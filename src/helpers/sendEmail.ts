import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/verificationMail";
import {resend} from "@/lib/resend"


export async function sendVerificationEmail(
  email : string,
  username : string,
  verifyCode : string
) : Promise<ApiResponse>
 {
try {
     await resend.emails.send({
        from: 'you@example.com',
        to: email,
        subject: 'Verification Code || Mistery Message App',
        react: VerificationEmail({username , otp:verifyCode}),
        
     })
     return { success: true, message: 'Verification email sent successfully.' };
} catch (error) {
    console.log(error , "faccing error to sennding email")
    return { success: false, message: ' getting error to send Verification email  .' };
}
}