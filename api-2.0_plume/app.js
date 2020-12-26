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
const qscc = require('./app/qscc')
const query = require('./app/query')

app.set('view-engine', 'ejs')

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
// // set secret variable
// app.set('secret', 'thisismysecret');
// app.use(expressJWT({
//     secret: 'thisismysecret'
// }).unless({
//     path: ['/users','/users/login', '/register']
// }));
// app.use(bearerToken());

logger.level = 'debug';


// app.use((req, res, next) => {
//     logger.debug('New req for %s', req.originalUrl);
//     if (req.originalUrl.indexOf('/users') >= 0 || req.originalUrl.indexOf('/users/login') >= 0 || req.originalUrl.indexOf('/register') >= 0) {
//         return next();
//     }
//     var token = req.token;
//     jwt.verify(token, app.get('secret'), (err, decoded) => {
//         if (err) {
//             console.log(`Error ================:${err}`)
//             res.send({
//                 success: false,
//                 message: 'Failed to authenticate token. Make sure to include the ' +
//                     'token returned from /users call in the authorization header ' +
//                     ' as a Bearer token'
//             });
//             return;
//         } else {
//             req.username = decoded.username;
//             req.orgname = decoded.orgName;
//             logger.debug(util.format('Decoded from JWT token: username - %s, orgname - %s', decoded.username, decoded.orgName));
//             return next();
//         }
//     });
// });

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

// get function from that file
const initializedPassport = require('./passport-config')
// pass const passport to function
initializedPassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
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

app.use(express.static(path.join(__dirname, "../template"), {index: '_'}));

app.get('/register', checkNotAuthenticated, async (req, res) => {
    res.render('register.ejs')

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

    // var token = jwt.sign({
    //     exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
    //     username: username,
    //     orgName: orgName
    // }, app.get('secret'));

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

});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/login', checkNotAuthenticated, (req, res) => {
    // res.render('login.ejs')
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '../template/login.html'));
    console.log(users);

})

app.get('/', checkAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../template/index.html'));
    // render file
    // res.render('index.ejs', {name: req.user.name});
    console.log("name = " + req.user.name);
    console.log("password = " + req.user.password);
    console.log("peer = " + req.user.peer);


});

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

// // Register and enroll user
// app.post('/register', async function (req, res) {
//     var username = req.body.username;
//     var orgName = req.body.orgName;
//     logger.debug('End point : /users');
//     logger.debug('User name : ' + username);
//     logger.debug('Org name  : ' + orgName);
//     if (!username) {
//         res.json(getErrorMessage('\'username\''));
//         return;
//     }
//     if (!orgName) {
//         res.json(getErrorMessage('\'orgName\''));
//         return;
//     }

//     var token = jwt.sign({
//         exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
//         username: username,
//         orgName: orgName
//     }, app.get('secret'));

//     console.log(token)

//     let response = await helper.registerAndGerSecret(username, orgName);

//     logger.debug('-- returned from registering the username %s for organization %s', username, orgName);
//     if (response && typeof response !== 'string') {
//         logger.debug('Successfully registered the username %s for organization %s', username, orgName);
//         response.token = token;
//         res.json(response);
//     } else {
//         logger.debug('Failed to register the username %s for organization %s with::%s', username, orgName, response);
//         res.json({ success: false, message: response });
//     }

// });

// // Login and get jwt
// app.post('/users/login', async function (req, res) {
//     var username = req.body.username;
//     var orgName = req.body.orgName;
//     logger.debug('End point : /users');
//     logger.debug('User name : ' + username);
//     logger.debug('Org name  : ' + orgName);
//     if (!username) {
//         res.json(getErrorMessage('\'username\''));
//         return;
//     }
//     if (!orgName) {
//         res.json(getErrorMessage('\'orgName\''));
//         return;
//     }

//     var token = jwt.sign({
//         exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
//         username: username,
//         orgName: orgName
//     }, app.get('secret'));

//     let isUserRegistered = await helper.isUserRegistered(username, orgName);

//     if (isUserRegistered) {
//         res.json({ success: true, message: { token: token } });

//     } else {
//         res.json({ success: false, message: `User with username ${username} is not registered with ${orgName}, Please register first.` });
//     }
// });


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
            args = [req.body.cargoOwner,
                req.body.loadingPoint,
                req.body.loadingDateTime,
                req.body.deliverygpoint,
                req.body.deliverygDateTime,
                req.body.productid,
                req.body.quantity,
                req.body.total_weight,
                req.body.pakcingdim,];
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
            args = [req.body.transactionID,
                req.body.subcontact,
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
            args = [req.body.transactionID,
                req.body.truckID,
                ];
        } else if (fcn === "changeDataJobAssignment") {
            args = [req.body.myjobassignmentID,
                req.body.transactionID,
                req.body.truckID,
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
            args = [req.body.jobassigninfo,
                req.body.startmileageno,
                req.body.loadingend,
                ];
        } else if (fcn === "changeDataloadinginfo") {
            args = [req.body.loadingID,
                req.body.jobassigninfo,
                req.body.startmileageno,
                req.body.loadingend,
                ];
        } else if (fcn === "deleteDataloadinginfo") {
            args = [req.body.loadingID,
                ];
        } else if (fcn === "createdeliveryinfo") {
            args = [req.body.jobassigninfo,
                req.body.finishmileageno,
                req.body.deliveryend,
                ];
        } else if (fcn === "changeDatadeliveryinfo") {
            args = [req.body.deliveryID,
                req.body.jobassigninfo,
                req.body.finishmileageno,
                req.body.deliveryend,
                ];
        } else if (fcn === "deleteDatadeliveryinfo") {
            args = [req.body.deliveryID,
                ];
        }
            
        

        console.log(args);
        console.log(typeof(req.body.loadingDateTime));


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


app.get('/channels/mychannel/chaincodes/orderinfo', checkAuthenticated, async (req, res) => {   
    res.sendFile(path.join(__dirname, '../template/transaction.html'));
    console.log("name = " + req.user.name);
    console.log("password = " + req.user.password);
    console.log("peer = " + req.user.peer);
})

// app.get('/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
//     try {
//         logger.debug('==================== QUERY BY CHAINCODE ==================');

//         var channelName = req.params.channelName;
//         var chaincodeName = req.params.chaincodeName;
//         console.log(`chaincode name is :${chaincodeName}`)
//         let args = req.query.args;
//         let fcn = req.query.fcn;
//         let peer = req.query.peer;

//         logger.debug('channelName : ' + channelName);
//         logger.debug('chaincodeName : ' + chaincodeName);
//         logger.debug('fcn : ' + fcn);
//         logger.debug('args : ' + args);

//         if (!chaincodeName) {
//             res.json(getErrorMessage('\'chaincodeName\''));
//             return;
//         }
//         if (!channelName) {
//             res.json(getErrorMessage('\'channelName\''));
//             return;
//         }
//         if (!fcn) {
//             res.json(getErrorMessage('\'fcn\''));
//             return;
//         }
//         if (!args) {
//             res.json(getErrorMessage('\'args\''));
//             return;
//         }
//         console.log('args==========', args);
//         args = args.replace(/'/g, '"');
//         args = JSON.parse(args);
//         logger.debug(args);

//         let message = await query.query(channelName, chaincodeName, args, fcn, req.username, req.orgname);

//         const response_payload = {
//             result: message,
//             error: null,
//             errorData: null
//         }

//         res.send(response_payload);
//     } catch (error) {
//         const response_payload = {
//             result: null,
//             error: error.name,
//             errorData: error.message
//         }
//         res.send(response_payload)
//     }
// });

// app.get('/qscc/channels/:channelName/chaincodes/:chaincodeName', async function (req, res) {
//     try {
//         logger.debug('==================== QUERY BY CHAINCODE ==================');

//         var channelName = req.params.channelName;
//         var chaincodeName = req.params.chaincodeName;
//         console.log(`chaincode name is :${chaincodeName}`)
//         let args = req.query.args;
//         let fcn = req.query.fcn;
//         // let peer = req.query.peer;

//         logger.debug('channelName : ' + channelName);
//         logger.debug('chaincodeName : ' + chaincodeName);
//         logger.debug('fcn : ' + fcn);
//         logger.debug('args : ' + args);

//         if (!chaincodeName) {
//             res.json(getErrorMessage('\'chaincodeName\''));
//             return;
//         }
//         if (!channelName) {
//             res.json(getErrorMessage('\'channelName\''));
//             return;
//         }
//         if (!fcn) {
//             res.json(getErrorMessage('\'fcn\''));
//             return;
//         }
//         if (!args) {
//             res.json(getErrorMessage('\'args\''));
//             return;
//         }
//         console.log('args==========', args);
//         args = args.replace(/'/g, '"');
//         args = JSON.parse(args);
//         logger.debug(args);

//         let response_payload = await qscc.qscc(channelName, chaincodeName, args, fcn, req.username, req.orgname);

//         // const response_payload = {
//         //     result: message,
//         //     error: null,
//         //     errorData: null
//         // }

//         res.send(response_payload);
//     } catch (error) {
//         const response_payload = {
//             result: null,
//             error: error.name,
//             errorData: error.message
//         }
//         res.send(response_payload)
//     }
// });