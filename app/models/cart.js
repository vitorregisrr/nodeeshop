const fs = require('fs');
const path = require('path');
const rootPath = require('../util/path');
const cartData = path.join(rootPath, 'app', 'data', 'cart.json');

const getCartByFile = (cb) => {
    fs.readFile(cartData, (err, fileContent) => {

        let cart = { prods: [], totalPrice: 0};

        if(!err){
            cart = JSON.parse(fileContent);
            console.log(cart)
        }else{
            console.log(err);
        }

        cb(cart);
    });
};

module.exports = class Cart{
    static new(prodID, prodPrice, cb){

        getCartByFile(cart => {

            // O produto já existe?
            let newProd;
            let alreadyExistsIndex = cart.prods.findIndex( p => p.id == prodID);

            if(alreadyExistsIndex !== -1){
                //Se foi encontrado um index, só aumente a quantidade!
                newProd = {...cart.prods[alreadyExistsIndex]};
                newProd.qty += 1;
                cart.prods[alreadyExistsIndex] = newProd;
            }else{
                //Se não foi encontrado um index, crie um novo produto!
                newProd = {
                    id: prodID,
                    price: prodPrice,
                    qty: 1
                }
                cart.prods.push(newProd);
            }

            cart.totalPrice += prodPrice;
            fs.writeFile(cartData, JSON.stringify(cart), err => {});
        });
    }
}