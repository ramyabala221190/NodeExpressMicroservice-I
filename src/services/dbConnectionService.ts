import { CustomError } from "../app";
import { carts } from "../data/seedData";
import dbClient from "../dbClient";
import cartModel from "../models/cartModel";

export async function connectToDb(){
    try{
    await dbClient.connect();
    await loadCarts();
    }
    catch(err){
       throw new CustomError(`Error connecting to DB:${err}`,500);
    }
}

export async function loadCarts(){
    try{
        await cartModel.insertMany(carts)
        }
   catch(err){
           throw new CustomError("Loading products to DB",500);
    }
}