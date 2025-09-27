import express from "express";
import { createCartController, deleteCartController, getCartDetailController, getCartsController, 
    sendMessageToProductMicroservice, 
    updateCartController, welcomeCartController } from "../controllers/cartController";

const cartRouter= express.Router();


cartRouter.route('/')
.get(welcomeCartController);

cartRouter.route('/products')
.get(sendMessageToProductMicroservice);

cartRouter.route('/carts')
.get(getCartsController)
.post(createCartController);

cartRouter.route('/carts/:id')
.get(getCartDetailController)
.delete(deleteCartController)
.put(updateCartController);


export default cartRouter;