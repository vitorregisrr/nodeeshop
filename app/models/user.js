const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('../models/order');

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number
            }
        }],
    },
    password: {
        type: String,
        required: true
    }
});

User.methods.addToCart = function (product) {
    const alreadyExists = this.cart.items.findIndex(item => item.productId.toString() == product._id.toString());
    const updatedCart = { ...this.cart};

    if (alreadyExists != -1) {
        updatedCart.items[alreadyExists].quantity += 1;

    } else {
        updatedCart.items.push({
            productId: product._id,
            quantity: 1
        });
    }

    this.cart = updatedCart;
    return this.save();
}

User.methods.removeFromCart = function(productId){
    const updatedItems = this.cart.items.filter( i => i.productId.toString() != productId.toString());
    this.cart.items = updatedItems;
    return this.save();
}

User.methods.clearCart = function(){
    this.cart = {
        items: []
    }
    return this.save();
}

User.methods.newOrder = function(){
    const order = new Order({
        user: this._id,
        items: this.cart.items
    })
    return order.save();
}

module.exports = mongoose.model('User', User);