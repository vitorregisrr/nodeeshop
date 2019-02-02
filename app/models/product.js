const mongodb = require('mongodb');
const getDB = require('../util/db').getDB;

class Product {
    constructor(form) {
        this.title = form.title;
        this.price = form.price;
        this.desc = form.desc;
        this.img = form.img;
        this.userId = form.userId;
        if (form.id) {
            this._id = new mongodb.ObjectId(form.id);
        }
    }

    save() {
        return getDB()
            .collection('products')
            .insertOne(this)
            .then(resul => {
                return resul;
            })
            .catch(err => {
                console.log(err);
            })
    }

    update() {
        return getDB()
            .collection('products')
            .updateOne({
                _id: new mongodb.ObjectId(this._id)
            }, {
                $set: this
            })
            .then(resul => {
                return resul;
            })
            .catch(err => {
                console.log(err);
            })
    }

    static fetchAll() {

        return getDB()
            .collection('products')
            .find()
            .toArray()
            .then(prods => {
                return prods;
            })
            .catch(err => console.log(err));
    }

    static getById(id) {
        return getDB()
            .collection('products')
            .find({
                _id: new mongodb.ObjectId(id)
            })
            .next()
            .then(prod => {
                return prod;
            })
            .catch(err => console.log(err));
    }

    static deleteById(id) {
        return getDB()
            .collection('products')
            .deleteOne({
                _id: new mongodb.ObjectId(id)
            })
            .then(prod => {
                return prod;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;