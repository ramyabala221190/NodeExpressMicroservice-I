import { NextFunction, Request, Response } from "express";
import { createCartService, deleteCartService, 
    getAllCartsService, 
    getCartDetailService, 
    messageToProductMicroservice, 
    updateCartService } from "../services/cartService";


 export async function welcomeCartController(req:Request,res:Response,next:NextFunction){
    res.status(200).send(`
    Hey You are sucessfully connected to CartMicroservice in ${process.env.APP_ENV} environment on port ${process.env.APP_HTTP_PORT}.\n
    Your API Gateway routing this request is ${process.env.API_GATEWAY} on port ${process.env.API_GATEWAY_PORT}
    `);
 }   

export async function getCartsController(req:Request,res:Response,next:NextFunction){
    try{
    let cartsList=await getAllCartsService();
    res.status(200).json({message:"Carts retreived successfully",carts:cartsList});
    }
    catch(err){
       next(err);
    }
}

export async function sendMessageToProductMicroservice(req:Request,res:Response,next:NextFunction){
    try{
   let products=await messageToProductMicroservice();
   res.status(200).json({message:"Products retreived successfully",products:products});
    }
    catch(err){
        next(err);
    }
}


export async function getCartDetailController(req:Request,res:Response,next:NextFunction){
    try{
        let cart=await getCartDetailService(req.params.id);
        res.status(200).json({message:"Carts retreived successfully",carts:cart});
        }
        catch(err){
           next(err);
        }
}

export async function deleteCartController(req:Request,res:Response,next:NextFunction){
try{
   const deleteCount=await deleteCartService(req.params.id);
   res.status(204).json({message:"Cart deleted successfully",count:deleteCount});
}
catch(err){
    next(err);
}

}

export async function createCartController(req:Request,res:Response,next:NextFunction){
    try{
    const newCart=await createCartService(req.body);
     res.status(201).json({message:"Cart created successfully",carts:newCart});
    }
    catch(err){
        next(err);
    }
}

export async function updateCartController(req:Request,res:Response,next:NextFunction){
    try{
       const updatedCart=updateCartService(req.params.id,req.body);
       res.status(200).json({message:"Cart updated successfully",carts:updatedCart})
    }
    catch(err){
        next(err);
    }
}