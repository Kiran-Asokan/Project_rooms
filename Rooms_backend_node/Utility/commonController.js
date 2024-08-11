const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const Users = require('../DAL/Schemas/UserSchema')

const commonController = {
    validateLogin: async function(req, res, next){
        try {
            let {email, password } = req.body;
            // check wheather the input fields are empty
            if(email == ""){
                res.status(403).send('Please enter email');
            }else if(!password || password == ""){
                res.status(403).send('Please enter password');
            }else{
                next();
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
        
    },

    validateRegisterForm: async function(req, res, next){
        try {
            const {name, password, confirmPassword, role, status, phone, email } = req.body;
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&~#^])[A-Za-z\d@$!%*?&~#^]{8,}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            // Validating form fields
            if(name == ""){
                res.status(200).send({
                    Error: 'Please fill name'
                });
            }else if(password == "" || confirmPassword == "" || !passwordRegex.test(password)){
                res.status(200).send({
                    Error: 'Please fill password and confirm password properly'
                });
            }else if(confirmPassword !== password){
                res.status(200).send({
                    Error: 'password is not matched'
                });
            }else if(role == ""){
                res.status(200).send({
                    Error: 'please select role'
                });
            }else if(phone == ""){
                res.status(200).send({
                    Error: 'please fill phone number'
                });
            }else if(email == "" || !emailRegex.test(email)){
                res.status(200).send({
                    Error: 'please fill valid email'
                });
            }
            else if(status == ""){
                res.status(200).send({
                    Error: 'please enter status'
                });
            }else{
                next()
            }

        } catch (error) {
            res.status(500).send(error.message);
        }
        
    },

    validateBillForm: async function(req, res, next){
        try {
            let {amount, dueDate, status, userId, billType } = req.body;

            if(amount == "" || dueDate == "" || status == "" || userId == "" || billType == ""){
                res.status(200).send('Please fill all the fields');
            }else{
                next()
            }
            
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    createToken: async function(user){
        try {
            console.log(user.id, 'user')
            const payload = {
                userId: user.id,
                email: user.email
            }
            const key = process.env.SECRETKEY
            const token = jwt.sign(payload, key, {expiresIn: 84680})
            if(token){
                await Users.updateOne({_id: user.id}, {
                    $set: {token}
                })
                user.save();
                return {user, token}
            }
        } catch (error) {
            console.log(error);
            return { APIError: error };
        }
        
    },
    verifyToken: async function(token) {
        try {
            
            const result = jwt.verify(token, key);
            return result;
        } catch (error) {
            
        }
    },
    encrypt: async function(message, secretKey){
        try {
            const key = crypto.scryptSync(secretKey, "salt", 24); //Create key
            const iv = Buffer.alloc(16, 0);
            // Generate different ciphertext everytime
            const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
            let encrypted =
              cipher.update(message, "utf8", "hex") + cipher.final("hex"); // Encrypted text
            //Deciphered textconsole.log(decrypted);
            return encrypted;
          } catch (err) {
            console.log({ APIError: err });
          }
    },
    decrypt: async function (message, secretKey) {
        try {
          const key = crypto.scryptSync(secretKey, "salt", 24);
          const iv = Buffer.alloc(16, 0);
          const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
          let decrypted =
            decipher.update(message, "hex", "utf8") + decipher.final("utf8");
    
          return decrypted;
        } catch (err) {
          console.log(err.message);
          return { APIError: err };
        }
    }
    
}

module.exports = commonController