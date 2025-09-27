import axios from "axios";
import { CustomError } from "../app";
import cartModel, { CartModel } from "../models/cartModel";
import https from 'https';



export async function getAllCartsService(){
    try{
      const product=await cartModel.find();
      return product;
    }
    catch(err){
       throw new CustomError(`Error fetching products:${err}`,500);
    }
}

export async function messageToProductMicroservice(){
  try{
    let products= await axios.get(
      `${process.env.protocol}://${process.env.API_GATEWAY}:${process.env.API_GATEWAY_PORT}/${process.env.PRODUCT_MICROSERVICE_MAPPING}/products`);
    return products.data; 
  }
     catch(err){
      throw new CustomError(`Error fetching carts:${err}`,500);
     }
}

export async function getCartDetailService(cartId:string){
    try{
      const product=await cartModel.findById(cartId);
      return product;
    }
    catch(err){
       throw new CustomError(`Error fetching carts:${err}`,500);
    }
}

export async function deleteCartService(cartId:string){
  try{
   const deletedProduct= await cartModel.findByIdAndDelete(cartId);
   if(!deletedProduct){
    throw new CustomError("Cart not found",404);
  } 
  }
  catch(err){
    throw err; //just rethrowing the error
  }
}

export async function createCartService(newCart:CartModel){
try{
   const newProd=await cartModel.insertOne(newCart);
   return newProd;
}
catch(err){
  throw new CustomError(`Error creating product:${err}`,500)
}
}

export async function updateCartService(cartId:string,updatedCart:CartModel){
 try{
    const updatedCrt=await cartModel.findByIdAndUpdate(cartId,updatedCart,{new:true,runValidators: true });
    //{new :true} ensures updated document is returned
    // by default schema validation is not done so runValidators:true needs to be passed
    return updatedCrt;
 }
 catch(err){
  throw new CustomError(`Error updating cart:${err}`,500)

 }
}

