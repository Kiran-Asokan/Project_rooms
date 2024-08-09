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
            if(!user){
                response.status(403).send('Account not found , Please Sign Up');
            }else if (user.password !== password){
                response.status(403).send('Wrong Password');
            }else{
                response.status(200).send('Login Successfull');
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
                response.status(403).send('Account already exist with these email');
            }else{

                

                const newUser = new Users({
                    name: name,
                    role: role,
                    status: status,
                    email: email,
                    phone: phone,
                    password: password
                })
    
                const result = await newUser.save()

                const newBill = new Bills({
                    amount: 500,
                    userId: result._id.toString(),
                    status: 'pending',
                    billType: 'security'
                })
                await newBill.save()

                response.status(200).send('User SuccessFully Created');
            }
            
            

        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.get('/users', async (request, response) => {
        try {
            const users = await Users.find()
            response.status(200).send(users)
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
            response.status(200).send(bills)
        } catch (error) {
            response.status(500).send(error.message);
        }
    })

    app.put('/bills/pay', async(request, response) => {
        try {
            const billId = request.body.billId;
            await Bills.findOneAndUpdate({_id: billId},{status: 'paid'})
            response.status(200).send('Bill Succesfully Paid')
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
                console.log(bill)
                if(bill.billType == 'other' && bill.status == 'pending'){
                    pendingAmount += bill.amount
                }else if(bill.billType == 'other' && bill.status == 'paid'){
                    paidAmount += bill.amount
                }else if(bill.billType == 'security' && bill.status == 'paid'){
                    securityAmountPaid += bill.amount
                }
            })
            if(pendingAmount > securityAmount){
                totalPayableAmount = pendingAmount - securityAmount;
            }else if(pendingAmount < securityAmount){
                refuntAmount = securityAmount - pendingAmount
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