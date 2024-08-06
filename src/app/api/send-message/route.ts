import dbConnected from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(req:Request) {
    await dbConnected();
    const {username, content} = await req.json()
    try {
      const user =  await UserModel.findOne({username})
      if(!user) {
        return Response.json(
            { success: false, message: 'failed to found user' },
            { status: 402 }
          );
      }
    // is user acccepting messages
    if(!user.isAcceptingMessage){
        return Response.json(
            { success: false, message: 'user is not accepting messages' },
            { status: 401 }
          );
    }

    const newMessage  = {content , createdAt : new Date()}
   
     user.messages.push(newMessage as Message)
     await user.save()

     return Response.json(
        { success: true, message: 'message sent sucessfuly' },
        { status: 401 }
      );

    } catch (err) {
        console.error( err);
        return Response.json(
          { success: false, message: 'Error iin getting message acceptence status  ' },
          { status: 500 })
    }
}