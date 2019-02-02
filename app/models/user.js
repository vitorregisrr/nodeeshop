const mongodb = require('mongodb');
const getDB = require('../util/db').getDB;

class User {
    constructor(data) {
        this.username = data.username;
        this.email = data.email;
        this.cart = data.cart || {
            items: []
        }
        this._id = data._id;
    }

    save() {
        return getDB()
            .collection('users')
            .insertOne(this)
            .then(resul => {
                return resul;
            })
            .catch(err => {
                console.log(err);
            })
    }

    getCart() {
        const prodsIds = this.cart.items.map(item => item.prodId);
        return getDB()
            .collection('products')
            .find({
                _id: {
                    $in: [...prodsIds]
                }
            })
            .toArray()
            .then(prods => {
                return prods.map(item => {
                    return {
                        ...item,
                        quantity: this.cart.items.find(i => i.prodId.toString() == item._id.toString()).quantity
                    }
                });
            })
            .catch(err => console.log(err));
    }

    newCartProd(prod) {

        const alreadyExists = this.cart.items.findIndex(item => item.prodId.toString() == prod._id.toString());

        const updatedCart = { ...this.cart
        };

        if (alreadyExists != -1) {
            updatedCart.items[alreadyExists].quantity += 1;

        } else {
            updatedCart.items.push({
                prodId: prod._id,
                quantity: 1
            });
        }

        return getDB()
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            })
            .then(() => {
                this.cart = {
                    items: []
                };
                return getDB()
            })
            .catch(err => console.log(err));
    }

    removeFromCart(id) {
        const updatedItems = this.cart.items.filter(i => i.prodId.toString() != id.toString());
        const updatedCart = {
            items: updatedItems
        };
        return getDB()
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            })
            .then(resul => {
                return resul;
            })
            .catch(err => console.log(err));
    }

    addOrder() {
        return this.getCart()
            .then(prods => {
                const order = {
                    items: prods,
                    user: {
                        id: this._id,
                        name: this.username
                    }
                };
                return getDB()
                    .collection('orders')
                    .insertOne(order);
            })
            .then(resul => {
                return this.resetCart();
            })
            .catch(err => console.log(err));
    }

    getOrders(){
        return getDB()
            .collection('orders')
            .find(
                 { 'user.id' : new mongodb.ObjectId(this._id) }
            )
            .toArray()
            .then( orders => {
                return orders;
            })
            .catch ( err => console.log(err));
    }

    resetCart() {
        const updatedCart = {
            items: []
        };
        return getDB()
            .collection('users')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: {
                    cart: updatedCart
                }
            })
            .then(() => {
                this.cart = {
                    items: []
                };
                return getDB()
            })
            .catch(err => console.log(err));
    }

    static getById(id) {
        return getDB()
            .collection('users')
            .find({
                _id: new mongodb.ObjectId(id)
            })
            .next()
            .then(user => {
                return new User({ ...user
                });
            })
            .catch(err => console.log(err));
    }
}

module.exports = User;