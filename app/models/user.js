const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Order = require('./order'),
    Product = require('./product');

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
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product'
            },

            quantity: {
                type: Number
            }
        }],
    },
    resetToken: String,
    resetTokenExpiration: Date,
    password: {
        type: String,
        required: true
    }
});

User.methods.addToCart = function (product) {
    const alreadyExists = this.cart.items.findIndex(item => item.product.toString() == product._id.toString());
    const updatedCart = {
        ...this.cart
    };

    if (alreadyExists != -1) {
        updatedCart.items[alreadyExists].quantity += 1;

    } else {
        updatedCart.items.push({
            product: product._id,
            title: product.title,
            price: product.price,
            quantity: 1
        });
    }

    this.cart = updatedCart;
    return this.save();
}

User.methods.removeFromCart = function (productId) {
    const updatedItems = this.cart.items.filter(i => i.productId.toString() != productId.toString());
    this.cart.items = updatedItems;
    return this.save();
}

User.methods.clearCart = function () {
    this.cart = {
        items: []
    }
    return this.save();
}

User.methods.newOrder = function () {
    const itemsPromises = this.cart.items.map(i => {
        return Product.findById(i.product)
            .then(prod => {
                return item = {
                    product: i.product,
                    quantity: i.quantity,
                    title: prod.title,
                    price: prod.price
                };
            })
    });

    return Promise.all(itemsPromises)
    .then( items => {
        new Order({
            user: this._id,
            items: items
        })
        .save()
    })
}

module.exports = mongoose.model('User', User);