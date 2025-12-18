import { NextFunction, Request, Response } from "express";
import cartService from "../services/cartService";


class CartController{
    constructor(){
        console.log("CartController Instantiated");
    }

 async  welcomeCartController(req:Request,res:Response,next:NextFunction){
    res.status(200).send(`
    Hey You are sucessfully connected to CartMicroservice in ${process.env.APP_ENV} environment on port ${process.env.APP_HTTP_PORT}.\n
    Your API Gateway routing this request is ${process.env.API_GATEWAY} on port ${process.env.API_GATEWAY_PORT}
    `);
 }   

 async  getCartsController(req:Request,res:Response,next:NextFunction){
    try{
    let cartsList=await cartService.getAllCartsService();
    res.status(200).json({message:"Carts retreived successfully",carts:cartsList});
    }
    catch(err){
       next(err);
    }
}

 async  sendMessageToProductMicroservice(req:Request,res:Response,next:NextFunction){
    try{
   let products=await cartService.messageToProductMicroservice();
   res.status(200).json({message:"Products retreived successfully",products:products});
    }
    catch(err){
        next(err);
    }
}


 async  getCartDetailController(req:Request,res:Response,next:NextFunction){
    try{
        let cart=await cartService.getCartDetailService(req.params.id);
        res.status(200).json({message:"Carts retreived successfully",carts:cart});
        }
        catch(err){
           next(err);
        }
}

 async  deleteCartController(req:Request,res:Response,next:NextFunction){
try{
   const deleteCount=await cartService.deleteCartService(req.params.id);
   res.status(204).json({message:"Cart deleted successfully",count:deleteCount});
}
catch(err){
    next(err);
}

}

 async  createCartController(req:Request,res:Response,next:NextFunction){
    try{
    const newCart=await cartService.createCartService(req.body);
     res.status(201).json({message:"Cart created successfully",carts:newCart});
    }
    catch(err){
        next(err);
    }
}

 async  updateCartController(req:Request,res:Response,next:NextFunction){
    try{
       const updatedCart=cartService.updateCartService(req.params.id,req.body);
       res.status(200).json({message:"Cart updated successfully",carts:updatedCart})
    }
    catch(err){
        next(err);
    }
}
}

export default new CartController();