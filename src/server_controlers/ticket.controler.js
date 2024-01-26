import { TicketMongo } from "../DAO/classes/ticketClass.js"


const ticketService = new TicketMongo();

export const getAll=async(req, res)=>{
    const tickets= await ticketService.getAll();
    res.status(200).send({message:"success", payload:tickets})
}