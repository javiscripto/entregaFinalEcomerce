import mongoose from "mongoose";
import { now } from "mongoose";


const ticketCollection= "tickets";

const ticketSchema= new mongoose.Schema({
    code:{type:String},
    purchaseDateTime:{type:Date, default:now},
    amount:{type:Number},
    purchaser:{type:String}
})

export const ticketModel= mongoose.model(ticketCollection,ticketSchema)