import express from "express";
import cartController from "../controllers/cartController";

const cartRouter= express.Router();

cartRouter.route('/')
.get(cartController.welcomeCartController);

cartRouter.route('/products')
.get(cartController.sendMessageToProductMicroservice);

cartRouter.route('/carts')
.get(cartController.getCartsController)
.post(cartController.createCartController);

cartRouter.route('/carts/:id')
.get(cartController.getCartDetailController)
.delete(cartController.deleteCartController)
.put(cartController.updateCartController);


export default cartRouter;