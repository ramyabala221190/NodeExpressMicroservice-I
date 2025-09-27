import * as mongoose from "mongoose"

export interface ProductModel{
    id: number,
    title: string,
    price: number,
    quantity: number,
    total: number,
    discountPercentage: number,
    discountedTotal: number,
    thumbnail: string
  
}

export interface CartModel{
    id:number,
    products:ProductModel[]
}

const cartSchema=new mongoose.Schema({
    id:Number,
    products:Array<{
        id: Number,
        title: String,
        price: Number,
        quantity: Number,
        total: Number,
        discountPercentage: Number,
        discountedTotal: Number,
        thumbnail: String  
    }>
})

export default mongoose.model("Cart",cartSchema); //collection name will be carts i.e plural lowercase of model name