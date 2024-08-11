const mongoose = require("mongoose")

const billSchema = new mongoose.Schema({
    amount: {
        type: String,
    },
    dueDate:{
        type: String,
    },
    userId:{
        type: String,
        require: true
    },
    status:{
        type: String,
        require: true
    },
    billType:{
        type: String,
        require: true
    }
})

const BILL = new mongoose.model("BILL", billSchema)

module.exports = BILL