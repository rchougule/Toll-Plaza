const Express = require('express');
const Cors = require('cors');
const BodyParser = require('body-parser');
const DB = require('./Services/DB').module;
const ResponseBody = require('./Lib/ResponseBody').ResponseBody;
const _PORT_ = 3000;
const _HOST_ = '192.168.43.104';

const app = Express();
app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));

app.post('/registerUser', async (req, res) => {
    const { name, emailID, vehicle, password } = req.body;
    try {
        await DB.addUser({name, emailID, vehicle, password});
        let responseBody = new ResponseBody(200, 'PROFILE_CREATED');
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);
    } catch (e) {
        let responseBody = new ResponseBody(400, e.toString());
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);
    }
})

app.post('/login', async (req, res) => {
    const { emailID, password } = req.body;
    try {
        const profile = await DB.login({emailID, password});
        let responseBody = new ResponseBody(200, 'USER_AUTHENTICATED', profile);
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);

    } catch (e) {
        let responseBody = new ResponseBody(401, e.toString());
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);
    }
})

app.post('/travelToll', async (req, res) => {
    const { emailID, source, destination, amount, vehicle } = req.body;
    try {
        const tollResult = await DB.addTollData({emailID, source, destination, amount:parseInt(amount), vehicle});
        let responseBody = new ResponseBody(200, tollResult);
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);
    } catch (e) {
        let responseBody = new ResponseBody(500, e.toString());
        console.log(responseBody);
        res.status(responseBody.statusCode).json(responseBody);
    }
})

app.listen(_PORT_, _HOST_, () => {
    console.log(`[INFO] Server Started on ${_HOST_}:${_PORT_}`);
})