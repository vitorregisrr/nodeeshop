const fs = require('fs');
const rootPath = require('../util/path');
const path = require('path');
const prodData = path.join(rootPath, 'app', 'data', 'products.json');

const getProdsByFile = (cb) => {
    fs.readFile(prodData, (err, fileContent) => {
        let prods = !err ? JSON.parse(fileContent) : [];
        cb(prods);
    });
};

class Product {
    constructor(form) {
        this.title = form.title;
        this.img = form.img;
        this.price = form.price;
        this.desc = form.desc;
        this.id = form.id ? form.id : Math.random(0, 100);
    }

    save() {
        getProdsByFile((prods) => {
            prods.push(this);
            fs.writeFile(prodData, JSON.stringify(prods), err => {});
        });
    }

    edit(){
        getProdsByFile((prods) => {
            const oldProdIndex = prods.findIndex( item => item.id == this.id);
            prods[oldProdIndex] = this;
            fs.writeFile(prodData, JSON.stringify(prods), err => {});
        });
    }

    static fetchAll(cb) {
        getProdsByFile((prods) => {
            cb(prods);
        });
    }

    static getProd(id, cb){
        getProdsByFile((prods) => {
            let prod = prods.find( item => item.id == id);
            cb(prod);
        });
    }
}

module.exports = Product;