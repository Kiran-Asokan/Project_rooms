const commonController = require('../Utility/commonController')
const Users = require("../DAL/Schemas/UserSchema")
const Bills = require("../DAL/Schemas/BillSchema")
const routes = (app) => {

    // User Login Endpoint
    app.post('/login', async (request, response, next) => {
        // validate login form
        await commonController.validateLogin(request, response, next)
    },async(request, response) => {
        try {
            let {email, password} = request.body;
            
            const user = await Users.findOne({email: email});
            const decryptedPassword = await commonController.decrypt(user.password, process.env.SECRETKEY)
            if(!user){
                response.status(403).send('Account not found , Please Sign Up');
            }else if (decryptedPassword !== password){
                response.status(403).send('Wrong Password');
            }else{
                const token = await commonController.createToken(user);

                let result = {
                    token: token.token,
                    user: {
                        id: token.user.id,
                        name: token.user.name,
                        role: token.user.role,
                        status: token.user.status,
                        email: token.user.email,
                        phone: token.user.phone
                    }
                }

                response.status(200).send({
                    Message: 'Login Successfull',
                    token: result
                });
            }    
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    // User Login Endpoint
    app.post('/logout',async(request, response) => {
        try {
            const { userId } = request.body; 
            const user = Users.findOne({_id: userId});
            if(user){
                user.token = "";
                response.status(200).send('Logged out Succesfully')
            }
            
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    // Create user Endpoint
    app.post('/users', async (request, response, next) => {
        await commonController.validateRegisterForm(request, response, next)
    }, async (request, response) => {
        try {
            const {name, password, role, status, phone, email } = request.body;

            const user = await Users.findOne({email: email});
            if(user){
                response.status(200).send('Account already exist with these email');
            }else{

                const encryptedPassword = await commonController.encrypt(password, process.env.SECRETKEY)

                const newUser = new Users({
                    name: name,
                    role: role,
                    status: status,
                    email: email,
                    phone: phone,
                    password: encryptedPassword
                })
    
                const result = await newUser.save()

                const newBill = new Bills({
                    amount: 500,
                    userId: result._id.toString(),
                    status: 'paid',
                    billType: 'security'
                })
                await newBill.save()

                response.status(200).send({
                    user: newUser,
                    Message: 'User SuccessFully Created'
                });
            }
            
            

        } catch (error) {
            response.status(500).send({
                Error: error.message
            });
        }
    })

    app.get('/users', async (request, response) => {
        try {
            const users = await Users.find()
            let resposneData = users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    email: user.email,
                    phone: user.phone
                }
            })
            response.status(200).send(resposneData)
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.post('/bills', async (request, response, next) => {
        await commonController.validateBillForm(request, response, next)
    }, async (request, response) => {
        try {
            const {amount, dueDate, status, userId, billType} = request.body;

            let bill = new Bills({
                amount: amount,
                dueDate: dueDate,
                userId: userId,
                status: status,
                billType: billType
            })
            await bill.save()

            response.status(200).send("Bill Created SuccesFully")

        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.get('/users/bills', async (request, response) => {
        try {
            const userId = request.query.id;
            let bills = await Bills.find({userId: userId});
            let resposneData = bills.map(bill => {
                return {
                    id: bill.id,
                    amount: bill.amount,
                    billType: bill.billType,
                    status: bill.status,
                    dueDate: bill.dueDate,
                    email: bill.email
                }
            })
            response.status(200).send(resposneData)
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.put('/bills/pay', async(request, response) => {
        try {
            const billId = request.body.billId;
            let bill = await Bills.findOne({_id: billId})
            bill.status = 'paid'
            await bill.save()
            response.status(200).send({
                Message: "Payment Successfull",
                bill:{
                    id: bill.id,
                    amount: bill.amount,
                    billType: bill.billType,
                    status: bill.status,
                    dueDate: bill.dueDate,
                    email: bill.email
                }
            })
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.put('/users/vacate', async (request, response) => {
        try {
            const userId = request.body.userId;

            let bills = await Bills.find({userId: userId});
            let paidAmount = 0;
            let securityAmountPaid = 0;
            let pendingAmount = 0;
            let totalPayableAmount = 0;
            let refuntAmount = 0;
            bills.forEach(bill => {
                if(bill.billType == 'other' && bill.status == 'pending'){
                    pendingAmount += parseInt(bill.amount)
                }else if(bill.billType == 'other' && bill.status == 'paid'){
                    paidAmount += parseInt(bill.amount)
                }else if(bill.billType == 'security' && bill.status == 'paid'){
                    securityAmountPaid += parseInt(bill.amount)
                }
            })
            if(pendingAmount > securityAmountPaid){
                totalPayableAmount = pendingAmount - securityAmountPaid;
            }else if(pendingAmount < securityAmountPaid){
                refuntAmount = securityAmountPaid - pendingAmount
            }
            
            await Users.findOneAndUpdate({_id: userId},{status: 'vacate'})
            let result = {
                paidAmount,
                pendingAmount,
                totalPayableAmount,
                refuntAmount,
                securityAmountPaid
            }
            response.status(200).send(result)

        } catch (error) {
            response.status(500).send(error.message);
        }
    })
}

module.exports = routes