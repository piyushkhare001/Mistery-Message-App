import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnected from '@/lib/dbConnect'
import UserModel from '@/model/User'
import {User} from 'next-auth'


export async function POST(req : Request){
    await dbConnected();



    // for getting session to find which user is login 
    const session = await getServerSession(authOptions)
    const user:User = session?.user;

    if(!session || !session?.user){
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
          );
    }

     // fetch user id

     const userId = user._id

     const {acceptMessage} = await req.json()

     try{
      const updateUser =  await UserModel.findByIdAndUpdate(
        userId,
        {isAcceptingMessage  : acceptMessage},
        {new:true}
       )
       if(!updateUser){
        return Response.json(
            {
              success: false,
              message: 'Unable to find user to update message acceptance status',
            },
            { status: 404 }
          );
       }
          // Successfully updated message acceptance status
    return Response.json(
        {
          success: true,
          message: 'Message acceptance status updated successfully',
          updateUser,
        },
        { status: 200 }
      );
     }catch(err){
        console.error('Error updating message acceptance status:', err);
        return Response.json(
          { success: false, message: 'Error updating message acceptance status' },
          { status: 500 })
     }
}  

