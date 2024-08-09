

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
                res.status(403).send('Please fill name');
            }else if(password == "" || confirmPassword == "" || !passwordRegex.test(password)){
                res.status(403).send('Please fill password and confirm password properly');
            }else if(confirmPassword !== password){
                res.status(403).send('password is not matched');
            }else if(role == ""){
                res.status(403).send('please select role');
            }else if(phone == ""){
                res.status(403).send('please fill phone number');
            }else if(email == "" || !emailRegex.test(email)){
                res.status(403).send('please fill valid email');
            }
            else if(status == ""){
                res.status(403).send('please enter status');
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
                res.status(403).send('Please fill all the fields');
            }else{
                next()
            }
            
        } catch (error) {
            res.status(500).send(error.message);
        }
    }
}

module.exports = commonController