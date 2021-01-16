'use strict';

// for login system
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const fs = require('fs');

//////////////////////////////
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const bodyParser = require('body-parser');
const http = require('http')
const util = require('util');
const express = require('express')
const app = express();
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const bearerToken = require('express-bearer-token');
const cors = require('cors');
const constants = require('./config/constants.json')

const host = process.env.HOST || constants.host;
const port = process.env.PORT || constants.port;


const helper = require('./app/helper')
const invoke = require('./app/invoke')
// const qscc = require('./app/qscc')
const query = require('./app/query')


app.engine('html', require('ejs').renderFile)

// app.set('view-engine', 'ejs')

// Login
app.use(flash())
// session
app.use(session({
    // key that wabt to keep secret
    secret: process.env.SESSION_SECRET,
    // save our session variable if nothing has changed
    resave: false,
    // do you want to save an empty value in the session if there is no value
    saveUninitialized: false
}))
app.use(passport.initialize())
// store variable to be persisted across entire session
app.use(passport.session())
app.use(methodOverride('_method'))



// app.options('*', cors());
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

logger.level = 'debug';


var server = http.createServer(app).listen(port, function () { console.log(`Server started on ${port}`) });
logger.info('****************** SERVER STARTED ************************');
logger.info('***************  http://%s:%s  ******************', host, port);
server.timeout = 240000;


function getErrorMessage(field) {
    var response = {
        success: false,
        message: field + ' field is missing or Invalid in the request'
    };
    return response;
}

app.use(express.static(path.join(__dirname, "/views"), {index: '_'}));
// app.use(express.static(path.join(__dirname, "../template"), {index: '_'}));

// get function from that file
const initializedPassport = require('./passport-config')
// pass const passport to function
initializedPassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

// search all data user
var users = []
fs.readFile('user/userData.json', 'utf-8', (err, data) => {
    if (err) {
        throw err;
    }

    users = JSON.parse(data);
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('checkAuthenticated');
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('checkNotAuthenticated');
        return res.redirect('/')
    }
    next()
}

// logout
app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


app.get('/register', checkNotAuthenticated, async (req, res) => {
    // res.render('register.ejs')
    res.sendFile(path.join(__dirname, '/views/register.html'));

});

// Register and enroll user
app.post('/register', checkNotAuthenticated, async function (req, res) {
    var username = req.body.name;
    var password = req.body.password;
    var email = req.body.email;
    var peer = req.body.peer;
    logger.debug('End point : /users');
    logger.debug('User name : ' + username);
    logger.debug('Org name  : ' + peer);
    if (!username) {
        res.json(getErrorMessage('\'username\''));
        return;
    }
    if (!peer) {
        res.json(getErrorMessage('\'orgName\''));
        return;
    }

    if (peer === 'peer2') {
        var subconID = req.body.subconID;

        let response = await helper.getRegisteredUser(username, peer, true);

    

    logger.debug('-- returned from registering the username %s for organization %s', username, peer);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, peer);
        // response.token = token;
        // after req.body correspond to what we put in name=
        try {
            // create hash for password 10 is how long hash we generate
            // await will return after wating for it
            const hashedPassword = await bcrypt.hash(password, 10);
            // now let's psuh these to users variable for store user's data
            let _id =  Date.now().toString();
            await users.push({
                id: _id,
                name: username,
                email: email,
                password: hashedPassword,
                peer: peer,
                subconID: subconID
            });
            // then redirect to login page
            await fs.readFile('user/userData.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
            
                var json = JSON.parse(data);
                json.push({ "id": _id,
                            "name": username,
                            "email": email,
                            "password": hashedPassword,
                        "peer" : peer,
                        "subconID": subconID});
                console.log(json);
            
                fs.writeFile("user/userData.json", JSON.stringify(json), (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("JSON data is saved.");
                    });
            
            });
            res.redirect('/login')
        } catch (e) {
            res.redirect('/register')
        }
            res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, peer, response);
        res.json({ success: false, message: response });
    }
        
    } else if (peer === 'peer3') {
        var subconID = req.body.subconID;
        var truckid = req.body.truckid;
        var newtruckid = subconID + truckid;

        let response = await helper.getRegisteredUser(username, peer, true);

    

    logger.debug('-- returned from registering the username %s for organization %s', username, peer);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, peer);
        // response.token = token;
        // after req.body correspond to what we put in name=
        try {
            // create hash for password 10 is how long hash we generate
            // await will return after wating for it
            const hashedPassword = await bcrypt.hash(password, 10);
            // now let's psuh these to users variable for store user's data
            let _id =  Date.now().toString();
            await users.push({
                id: _id,
                name: username,
                email: email,
                password: hashedPassword,
                peer: peer,
                subconID: subconID,
                truckid: newtruckid
            });
            // then redirect to login page
            await fs.readFile('user/userData.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
            
                var json = JSON.parse(data);
                json.push({ "id": _id,
                            "name": username,
                            "email": email,
                            "password": hashedPassword,
                        "peer" : peer,
                        "subconID": subconID,
                        "truckid": newtruckid});
                console.log(json);
            
                fs.writeFile("user/userData.json", JSON.stringify(json), (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("JSON data is saved.");
                    });
            
            });
            res.redirect('/login')
        } catch (e) {
            res.redirect('/register')
        }
            res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, peer, response);
        res.json({ success: false, message: response });
    }

    } else {

    let response = await helper.getRegisteredUser(username, peer, true);

    

    logger.debug('-- returned from registering the username %s for organization %s', username, peer);
    if (response && typeof response !== 'string') {
        logger.debug('Successfully registered the username %s for organization %s', username, peer);
        // response.token = token;
        // after req.body correspond to what we put in name=
        try {
            // create hash for password 10 is how long hash we generate
            // await will return after wating for it
            const hashedPassword = await bcrypt.hash(password, 10);
            // now let's psuh these to users variable for store user's data
            let _id =  Date.now().toString();
            await users.push({
                id: _id,
                name: username,
                email: email,
                password: hashedPassword,
                peer: peer
            });
            // then redirect to login page
            await fs.readFile('user/userData.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }
            
                var json = JSON.parse(data);
                json.push({ "id": _id,
                            "name": username,
                            "email": email,
                            "password": hashedPassword,
                        "peer" : peer});
                console.log(json);
            
                fs.writeFile("user/userData.json", JSON.stringify(json), (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log("JSON data is saved.");
                    });
            
            });
            res.redirect('/login')
        } catch (e) {
            res.redirect('/register')
        }
            res.json(response);
    } else {
        logger.debug('Failed to register the username %s for organization %s with::%s', username, peer, response);
        res.json({ success: false, message: response });
    }

}

});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '/views/login.html'));
    console.log(users);

})

app.get('/', checkAuthenticated, async (req, res) => {
    // res.sendFile(path.join(__dirname, '../template/index.html'));
    // render file
    // res.render('index.ejs', {name: req.user.name});
    try {
        console.log("name = " + req.user.name);
        console.log("password = " + req.user.password);
        console.log("peer = " + req.user.peer);
        var message;
        var channelName = 'mychannel';
        // var chaincodeName = 'orderinfo'
        var peer = req.user.peer;
        var name = req.user.name;
        // var fcn = 'queryAllTransactions';

        if (peer === "peer0") {

            // query all database
            message = await query.query(channelName, 'orderinfo', 'queryAllTransactions', name, peer);
            let work = await query.query(channelName, 'workinfo', 'queryAllWork', name, peer);
            let myassign = await query.query(channelName, 'myjobassignment', 'queryAllJobAssignmentInfo', name, peer);
            let subassign = await query.query(channelName, 'subjobassignment', 'queryAllsubjobassignment', name, peer);
            let loading = await query.query(channelName, 'loadinginfo', 'queryAllloadingInfo', name, peer);
            let delivery = await query.query(channelName, 'deliveryinfo', 'queryAlldeliveryinfo', name, peer);

            // check status 
            message = await query.setstatusorder(message, 'none');
            message = await query.checkstatus(message, delivery, 'delivery');
            message = await query.checkstatus(message, loading, 'loading');
            message = await query.checkstatus(message, myassign, 'myassign');
            message = await query.checkstatus(message, subassign, 'contractassign');
            message = await query.checkstatus(message, work, 'worktocontract');

            res.render(__dirname + '/views/index.html', {name: message});
        } else if (peer === "peer1") {
            message = await query.query(channelName, 'orderinfo', 'queryAllTransactions', name, peer);
            let work = await query.query(channelName, 'workinfo', 'queryAllWork', name, peer);
            let myassign = await query.query(channelName, 'myjobassignment', 'queryAllJobAssignmentInfo', name, peer);
            let subassign = await query.query(channelName, 'subjobassignment', 'queryAllsubjobassignment', name, peer);
            let loading = await query.query(channelName, 'loadinginfo', 'queryAllloadingInfo', name, peer);
            let delivery = await query.query(channelName, 'deliveryinfo', 'queryAlldeliveryinfo', name, peer);

            // check status 
            message = await query.setstatusorder(message, 'none');
            message = await query.checkstatus(message, delivery, 'delivery');
            message = await query.checkstatus(message, loading, 'loading');
            message = await query.checkstatus(message, myassign, 'myassign');
            message = await query.checkstatus(message, subassign, 'contractassign');
            message = await query.checkstatus(message, work, 'worktocontract');

            res.render(__dirname + '/views/index.html', {name: message});
        } else if (peer === "peer2") {
            message = [];
            let subconID =  req.user.subconID;
            let work  = await query.query(channelName, 'workinfo', 'queryAllWork', name, peer);
            let loading = await query.query(channelName, 'loadinginfo', 'queryAllloadingInfo', name, peer);
            let delivery = await query.query(channelName, 'deliveryinfo', 'queryAlldeliveryinfo', name, peer);

            let subwork = await query.checksubowner(subconID, work);
            let record;
            
            for (let index = 0; index < subwork.length; index++) {
                record = await query.querybyid(channelName, 'orderinfo', 'queryTransaction', name, subwork[index].Record.transOrderInfo ,peer);
                message.push({ Key: subwork[index].Record.transOrderInfo, Record: record});
                
            }

            // check status 
            message = await query.setstatusorder(message, 'none');
            message = await query.checkstatus(message, delivery, 'delivery');
            message = await query.checkstatus(message, loading, 'loading');
            
            res.render(__dirname + '/views/index.html', {name: message});
        } else if (peer === "peer3") {
            res.redirect('/car_owner');
            
        }
 
         console.log("result => ", message);
        
    } catch (err) {
        console.log('error = ', err);
    }

    

});

// car owner (peer3)
app.get('/car_owner', checkAuthenticated, async (req, res) => {
    try {
        var message = [];
        var channelName = 'mychannel';
        // var chaincodeName = 'orderinfo'
        var peer = req.user.peer;
        var name = req.user.name;
        
        var truckid =  req.user.truckid;
        var transporter = req.user.subconID;

        // message = await query.query(channelName, 'orderinfo', 'queryAllTransactions', name, peer);
        var myassign = await query.query(channelName, 'myjobassignment', 'queryAllJobAssignmentInfo', name, peer);
        var subassign = await query.query(channelName, 'subjobassignment', 'queryAllsubjobassignment', name, peer);

        var assign = await query.assignment(transporter, truckid, myassign, subassign);

        var record;
            
        for (let index = 0; index < assign.length; index++) {
            record = await query.querybyid(channelName, 'orderinfo', 'queryTransaction', name, assign[index].Record.transOrderInfo ,peer);
            message.push({ Key: assign[index].Record.transOrderInfo, Record: record});
                
        }

        let loading = await query.query(channelName, 'loadinginfo', 'queryAllloadingInfo', name, peer);
        let delivery = await query.query(channelName, 'deliveryinfo', 'queryAlldeliveryinfo', name, peer);

        message = await query.statustransport(message, loading, delivery);

        res.send(message);

    } catch (error) {
        console.log('error = ', error);
    }
});


// test for one page data
app.get('/car_owner_onepage', checkAuthenticated, async (req, res) => {
    try {
        var message;
        var channelName = 'mychannel';
        var peer = req.user.peer;
        var name = req.user.name;
        var key = req.query.key;
        console.log("Key => ", key);

        message = await query.querybyid(channelName, 'orderinfo', 'queryTransaction', name, key ,peer);
        console.log("message => ", message);
        res.send(message);

    } catch (error) {
        console.log('error = ', error);
    }
});

// Invoke transaction on chaincode on target peers
app.post('/channels/:channelName/chaincodes/:chaincodeName/fcn/:_fcn', async function (req, res) {
    try {
        logger.debug('==================== INVOKE ON CHAINCODE ==================');
        var peer = req.user.peer;
        var name = req.user.name;
        // var name = req.body.name;
        // var peer = req.body.peer;
        var chaincodeName = req.params.chaincodeName;
        var channelName = req.params.channelName;
        // var fcn = req.body.fcn;
        var fcn = req.params._fcn;
        // var args = req.body.args;
        var args;
        if (fcn === "createTransaction") {
            args = [req.body.cargo_owner,
                req.body.loading_point,
                req.body.loading_date_time,
                req.body.deliverygpoint,
                req.body.delivery_date_time,
                req.body.product_id,
                req.body.quantity,
                req.body.total_weight,
                req.body.packing_dimension,];
        } else if (fcn === "changeDataTransaction") {
            args = [req.body.transactionID,
                req.body.cargoOwner,
                req.body.loadingPoint,
                req.body.loadingDateTime,
                req.body.deliverygpoint,
                req.body.deliverygDateTime,
                req.body.productid,
                req.body.quantity,
                req.body.total_weight,
                req.body.pakcingdim,];
        } else if (fcn === "deleteTransaction") {
            args = [req.body.transactionID];
        } else if (fcn === "WorkOrderInfoCreate") {
            args = [req.body.transaction_order_info,
                req.body.subconID,
                ];
        } else if (fcn === "changeDataWork") {
            args = [req.body.workID,
                req.body.transactionID,
                req.body.cargoOwner,
                ];
        } else if (fcn === "deleteWork") {
            args = [req.body.workID,
                ];
        } else if (fcn === "createJobAssignmentInfo") {
            args = [req.body.transaction_order_info,
                req.body.work_truck_id,
                ];
        } else if (fcn === "changeDataJobAssignment") {
            args = [req.body.myjobassignmentID,
                req.body.transaction_order_info,
                req.body.work_truck_id,
                ];
        } else if (fcn === "deleteJobAssignment") {
            args = [req.body.myjobassignmentID,
                ];
        } else if (fcn === "createsubjobassignment") {
            args = [req.body.workID,
                req.body.transactionID,
                req.body.truckID,
                ];
        } else if (fcn === "changeDatasubjobassignment") {
            args = [req.body.subjobassignmentID,
                req.body.workID,
                req.body.transactionID,
                req.body.truckID,
                ];
        } else if (fcn === "deletesubjobassignment") {
            args = [req.body.subjobassignmentID,
                ];
        } else if (fcn === "createloadinginfo") {
            args = [req.body.transOrderInfo,
                req.body.jobassigninfo,
                req.body.startmileageno,
                req.body.loadingend,
                ];
        } else if (fcn === "changeDataloadinginfo") {
            args = [req.body.loadingID,
                req.body.transOrderInfo,
                req.body.jobassigninfo,
                req.body.startmileageno,
                req.body.loadingend,
                ];
        } else if (fcn === "deleteDataloadinginfo") {
            args = [req.body.loadingID,
                ];
        } else if (fcn === "createdeliveryinfo") {
            args = [req.body.transOrderInfo,
                req.body.jobassigninfo,
                req.body.finishmileageno,
                req.body.deliveryend,
                ];
        } else if (fcn === "changeDatadeliveryinfo") {
            args = [req.body.deliveryID,
                req.body.transOrderInfo,
                req.body.jobassigninfo,
                req.body.finishmileageno,
                req.body.deliveryend,
                ];
        } else if (fcn === "deleteDatadeliveryinfo") {
            args = [req.body.deliveryID,
                ];
        }
            


        logger.debug('name  : ' + name);
        logger.debug('peer : ' + peer);
        logger.debug('channelName  : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        logger.debug('fcn  : ' + fcn);
        logger.debug('args  : ' + args);
        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }
        if (!fcn) {
            res.json(getErrorMessage('\'fcn\''));
            return;
        }
        if (!args) {
            res.json(getErrorMessage('\'args\''));
            return;
        }

        let message = await invoke.invokeTransaction(channelName, chaincodeName, fcn, args, name, peer );
        console.log(`message result is : ${message}`)

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        res.send(response_payload);


    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});


app.get('/transaction', checkAuthenticated, async (req, res) => {   
    res.sendFile(path.join(__dirname, '/views/transaction.html'));
    console.log("name = " + req.user.name);
    console.log("password = " + req.user.password);
    console.log("peer = " + req.user.peer);
})

app.get('/workorder_info', checkAuthenticated, async (req, res) => {   
    res.sendFile(path.join(__dirname, '/views/workorder_info.html'));
    console.log("name = " + req.user.name);
    console.log("password = " + req.user.password);
    console.log("peer = " + req.user.peer);
})


app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
    try {
        logger.debug('==================== QUERY BY CHAINCODE ==================');
        var peer = req.user.peer;
        var name = req.user.name;
        // var peer = 'peer0';
        // var name = 'spizy';
        logger.debug('name : ' + name);
        logger.debug('peer : ' + peer);
        var channelName = req.params.channelName;
        var chaincodeName = req.params.chaincodeName;
        console.log(`chaincode name is :${chaincodeName}`)
        let args = req.query.args;
        let fcn = req.query.fcn;

        logger.debug('channelName : ' + channelName);
        logger.debug('chaincodeName : ' + chaincodeName);
        // logger.debug('fcn : ' + fcn);
        // logger.debug('args : ' + args);

        if (!chaincodeName) {
            res.json(getErrorMessage('\'chaincodeName\''));
            return;
        }
        if (!channelName) {
            res.json(getErrorMessage('\'channelName\''));
            return;
        }

        // let message = await query.query(channelName, chaincodeName, args, fcn, req.username, req.orgname);
        let message = await query.query(channelName, chaincodeName, fcn, name, peer, args);

        const response_payload = {
            result: message,
            error: null,
            errorData: null
        }
        // res.send(response_payload);
        // res.render('index.html', {name: message})
        res.render(__dirname + '/views/index.html', {name:response_payload});
        console.log(__dirname);
    } catch (error) {
        const response_payload = {
            result: null,
            error: error.name,
            errorData: error.message
        }
        res.send(response_payload)
    }
});
