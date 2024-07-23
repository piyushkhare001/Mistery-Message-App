import { boolean } from "zod"
import { Message } from "@/model/User"
export interface ApiResponse {
    success : boolean,
    message : string,
    isAcceptingMessage? : boolean,
    massage?: Array<Message>

}