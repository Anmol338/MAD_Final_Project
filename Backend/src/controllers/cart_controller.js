const CartModel = require('./../models/cart_model');

const CartController = {

    getCartForUser: async function(req, res){
        try{
            const user = req.params.user;   
            const foundCart = await CartModel.findOne({ user: user }).populate("items.product");

            if (!foundCart){
                return res.json({ success: true, data: [] });
            }

            return res.json({ success: true, data: foundCart.items });
        }
        catch (ex) {
            return res.json({ success: true, message: ex });
        }
    },

    addToCart: async function(req, res){
        try{
            const { product, user, quantity} = req.body;
            const foundCart = await CartModel.findOne({ user: user });

            // If the cart is not exist
            if (!foundCart){
                const newCart = new CartModel({ user: user });
                newCart.items.push({
                    product: product,
                    quantity: quantity
                });

                await newCart.save();
                return res.json({ success: true, data: newCart, message: "Product added to the cart successfully!" });
            }

            // If the item is already exist delete the old one
            const deletedItem = await CartModel.findOneAndUpdate(
                { user: user, "items.product": product },
                { $pull: { items: { product: product } } },
                { new: true }
            );

            // If the cart is already exist
            const updatedCart = await CartModel.findOneAndUpdate(
                { user: user },
                { $push: {items: { product: product, quantity: quantity } } },
                { new: true }
            ).populate("items.product");

            return res.json({ success: true, data: updatedCart.items, message: "Product added to the cart successfully!" });

        }
        catch (ex){
            return res.json({ success: true, message: ex });
        }
    },

    removeFromCart: async function(req, res){
        try{
            const { user, product}= req.body;
            const updatedCart = await CartModel.findOneAndUpdate(
                { user: user },
                { $pull: { items: { product: product } } },
                { new: true}
            ).populate("items.product");

            return res.json({ success: true, data: updatedCart.items, message: "Product remove from the cart successfully!" });
        }
        catch (ex){
            return res.json({ success: true, message: "Failed to remove from cart" });
        }
    }

};

module.exports = CartController;