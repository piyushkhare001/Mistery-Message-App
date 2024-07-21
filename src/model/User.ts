
import mongoose , {Document , Schema} from "mongoose";

export interface Message extends Document{
    content : string;
    createdAt : Date;
}

const MessageSchema : Schema<Message>= new  Schema({
      content : {
        type : String,
        required: true
      },
      createdAt : {
        type : Date,
        required : true,
        default : Date.now
      }
})

export interface User extends Document{
     username : string,
     email : string,
     password : string,
     verifyCode : string,
     isVerified : boolean,
     verifyCodeExpiry : Date,
     isAcceptingMessage : boolean,
     messages : Message[]
}

const UserSchema : Schema<User>= new  Schema({
  username : {
    type : String,
    required :  [true, "username is required"],
    unique : true,
    trim : true
  },
  email: {
    type : String,
    required : [true, "email is required"],
    unique : true,


  },
  password : {
         type : String,
        required : [true, "password is required"],
  },
  verifyCode : {
    type : String,
    required : [true, "Verifycode is required"],
    

  },
  isVerified : {
        type :  Boolean,
        required : [true, "Verification is required"],    
        default : false
  },
  verifyCodeExpiry : {
    type : Date,
    default : Date.now,
    required : [true, "Verify code expiry is required"],
  },
  isAcceptingMessage  : {
    type : Boolean,
    default :true
  },
  messages : [MessageSchema]
})



const UserModel = ( mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User" , UserSchema)

export default UserModel;