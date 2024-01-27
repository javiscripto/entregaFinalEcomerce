
import { logger } from "../../../logger/logger.js";
import { ticketModel } from "../models/ticket.model.js";



//esta clase será utilizada dentro del controlador cart 
export class TicketMongo{
    constructor(){};

    createTicket=async(data)=>{
        try {
            let newTicket= await ticketModel.create(data)
            logger.info(`ticket ${newTicket._id} creado correctamente`);
            return newTicket
        } catch (error) {
            logger.error(`error en db: ${error}`)
        }
    };



    getAll=async()=>{//this option is only available for admin role 
        try {
            
            const tickets= await ticketModel.find().lean();
            if(tickets.length<=0){
                return `no hay tickets que mostrar`
            }else{
                return tickets
            };
        } catch (error) {
            logger.error(`error en db: ${error}`)
        }
    }

    getById=async(ticketId)=>{
        try {
            const ticket= await ticketModel.findById(ticketId);
            if(!ticket)return `carrito con id ${ticketId} no encontrado`
            return ticket

        } catch (error) {
            logger.error(`error en db: ${error}`)
        }
    }
}