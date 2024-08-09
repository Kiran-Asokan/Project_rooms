const mongoose = require('mongoose')
const uri = process.env.CONNECT_STRING;

// connecting database to server
const DBConnection = () => {
    mongoose.connect(uri)
    .then(() => {
        console.log('Database Connection Successfull')
    })
    .catch(err => {
        console.log(err.message, 'pp')
    })
}


module.exports = DBConnection

