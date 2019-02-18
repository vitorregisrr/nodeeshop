const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema({
    user: {
        ref: 'User',
        type: Schema.Types.ObjectId,
        required: true
    },
    items: [{
        product: {
            ref: 'Product',
            type: Schema.Types.ObjectId,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },
        
        quantity: {
            type: Number,
            required: true
        }
    }],

});

module.exports = mongoose.model('Order', Order);