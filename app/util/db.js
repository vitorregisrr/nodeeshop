const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = cb => {
    MongoClient.connect(
        'mongodb+srv://vitorregis:santovitor123@nodeshop-wmkec.mongodb.net/shop?retryWrites=true',
        {
            useNewUrlParser: true
        }
    )
        .then( client => {
            console.log('Connected');
            _db = client.db();
            cb(client);
        })
        .catch( err => {
            console.log(err);
        });
};

const getDB = () =>{
    if(_db){
        return _db

    }else{
        throw new Error('Nenhuma Database encontrada!');
    }
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;