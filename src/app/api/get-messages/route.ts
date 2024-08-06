import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnected from '@/lib/dbConnect'
import UserModel from '@/model/User'
import {User} from 'next-auth'
import mongoose from 'mongoose';


export async function GET(req:Request) {
   await  dbConnected();
  // for getting session to find which user is login 
  const session = await getServerSession(authOptions)
  const user: User = session?.user;

  if(!session || !session?.user){
      return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
  }

   // fetch user id
// bcoz of we are writing mongodb aggeregate 
const userId = new mongoose.Types.ObjectId(user._id)

try{
  const user =  await UserModel.aggregate([
    { $match: { _id: userId } },
    { $unwind: '$messages' },
    { $sort: { 'messages.createdAt': -1 } },
    { $group: { _id: '$_id', messages: { $push: '$messages' } } },
  ]).exec();
   
   if (!user || user.length === 0){
    return Response.json(
        { success: false, message: 'user does not exits' },
        { status: 401 }
      );
   }
   return Response.json({
       success : true,
       messages  :  user[0].messages

   })

}catch(err){
    console.error( err);
    return Response.json(
      { success: false, message: 'Error in getting message acceptence status  ' },
      { status: 500 })
}
}

