const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const _DB_ = 'TOLLPLAZA';
const _URL_ = 'mongodb://192.168.43.104:27017';


const addUser = ((profileData) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(_URL_, { useNewUrlParser: true }, async (err, client) => {
            if(err) {
                reject('NO_DB_CONNECTION');
            } else {
                const DB = client.db(_DB_);
                const profiles = DB.collection('profiles');
                
                try {
                    await profiles.insertOne(profileData);
                    resolve('REGISTRATION_SUCCESSFUL');
                } catch (e) {
                    reject(e);
                }
                
            }
        })
    })
})

const login = ((userCredentials) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(_URL_, { useNewUrlParser: true}, async (err, client) => {
            if(err) {
                reject('NO_DB_CONNECTION');
            } else {
                const DB = client.db(_DB_);
                const profiles = DB.collection('profiles');
                const { emailID, password } = userCredentials;
                
                try {
                    const userData = await profiles.findOne({emailID, password}, {fields: {_id:0, password: 0}});
                    if(userData) {
                        resolve(userData);
                    } else {
                        reject('CHECK_CREDENTIALS');
                    }
                } catch (e) {
                    reject(e);
                }
            }
        })
    })
})

const addTollData = ((tollData) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(_URL_, { useNewUrlParser: true}, async (err, client) => {
            if(err) {
                reject('NO_DB_CONNECTION');
            } else {
                const DB = client.db(_DB_);
                const tollDataCollection = DB.collection('tollData');
                const { emailID, source, destination, amount, vehicle } = tollData;
                
                try {
                    await tollDataCollection.updateOne({emailID}, {$set: {source, destination, amount, paid: true, vehicle}}, {upsert: true});
                    resolve('TOLL_DATA_INSERTED');
                } catch (e) {
                    reject(e);
                }
            }
        })
    })
})

exports.module = {
    addUser,
    login,
    addTollData
}