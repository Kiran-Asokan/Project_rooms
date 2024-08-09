const express = require("express");
const bodyparser = require('body-parser')
const env = process.env.NODE_ENV || 'development';
// require('dotenv').config({ path: `${env}.env` }); 
require('dotenv').config({ path: `ENV/${env}.env` });
const routes = require('./Routes/routes')


const mongoConnect = require('./DAL/mongoose')

const app = express()
// Body-parser middleware
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use(express.static("public"));

routes(app)


app.listen(process.env.PORT, () => {
    console.log(`Server Running on the Port : ${process.env.PORT}`);
    mongoConnect()
})