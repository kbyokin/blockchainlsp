const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')
// const query = async (channelName, chaincodeName, args, fcn, username, org_name) => {

//     try {

//         // load the network configuration
//         // const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
//         // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
//         const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

//         // Create a new file system based wallet for managing identities.
//         const walletPath = await helper.getWalletPath(org_name) //.join(process.cwd(), 'wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the user.
//         let identity = await wallet.get(username);
//         if (!identity) {
//             console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
//             await helper.getRegisteredUser(username, org_name, true)
//             identity = await wallet.get(username);
//             console.log('Run the registerUser.js application before retrying');
//             return;
//         }

//         // Create a new gateway for connecting to our peer node.
//         const gateway = new Gateway();
//         await gateway.connect(ccp, {
//             wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
//         });

//         // Get the network (channel) our contract is deployed to.
//         const network = await gateway.getNetwork(channelName);

//         // Get the contract from the network.
//         const contract = network.getContract(chaincodeName);
//         let result;

//         if (fcn == "queryCar" || fcn == "queryCarsByOwner" || fcn == 'getHistoryForAsset' || fcn == 'restictedMethod') {
//             result = await contract.evaluateTransaction(fcn, args[0]);

//         } else if (fcn == "readPrivateCar" || fcn == "queryPrivateDataHash"
//             || fcn == "collectionCarPrivateDetails") {
//             result = await contract.evaluateTransaction(fcn, args[0], args[1]);
//             // return result

//         }
//         console.log(result)
//         console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

//         result = JSON.parse(result.toString());
//         return result
//     } catch (error) {
//         console.error(`Failed to evaluate transaction: ${error}`);
//         return error.message

//     }
// }

// exports.query = query
const query = async (channelName, chaincodeName, fcn, username, peer) => {
    console.debug('query at channelName:', channelName)
    console.debug('query at chaincodeName:', chaincodeName)
    console.debug('query with fcn:', fcn)
    console.debug('query by username:', username)
    console.debug('query at peer:', peer)
    try {

        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(peer) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(peer) //.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, peer, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

        // if (fcn == "queryCar" || fcn == "queryCarsByOwner" || fcn == 'getHistoryForAsset' || fcn == 'restictedMethod') {
        //     result = await contract.evaluateTransaction(fcn, args[0]);

        // } else if (fcn == "readPrivateCar" || fcn == "queryPrivateDataHash"
        //     || fcn == "collectionCarPrivateDetails") {
        //     result = await contract.evaluateTransaction(fcn, args[0], args[1]);
        //     // return result

        // }
        if (fcn == "queryAllTransactions") {
            result = await contract.evaluateTransaction(fcn);

        } else if (fcn == "queryAllWork") {
            result = await contract.evaluateTransaction(fcn);

        } else if (fcn == "queryAllJobAssignmentInfo") {
            result = await contract.evaluateTransaction(fcn);

        } else if (fcn == "queryAllsubjobassignment") {
            result = await contract.evaluateTransaction(fcn);

        } else if (fcn == "queryAllloadingInfo") {
            result = await contract.evaluateTransaction(fcn);

        } else if (fcn == "queryAlldeliveryinfo") {
            result = await contract.evaluateTransaction(fcn);

        }
        console.log(result)
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        await gateway.disconnect();
        result = JSON.parse(result.toString());
        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}


// query by id
const querybyid = async (channelName, chaincodeName, fcn, username, args, peer) => {
    console.debug('query at channelName:', channelName)
    console.debug('query at chaincodeName:', chaincodeName)
    console.debug('query with fcn:', fcn)
    console.debug('query by username:', username)
    console.debug('query at peer:', peer)
    try {

        // load the network configuration
        // const ccpPath = path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(peer) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(peer) //.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, peer, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);
        let result;

 
        if (fcn == "queryTransaction") {
            result = await contract.evaluateTransaction(fcn, args);

        } else if (fcn == "queryWorkOrderInfo") {
            result = await contract.evaluateTransaction(fcn, args);

        } else if (fcn == "queryJobassignInfo") {
            result = await contract.evaluateTransaction(fcn, args);

        } else if (fcn == "querysubjobassignment") {
            result = await contract.evaluateTransaction(fcn, args);

        } else if (fcn == "queryLoadinginfo") {
            result = await contract.evaluateTransaction(fcn, args);

        } else if (fcn == "queryDeliveryinfo") {
            result = await contract.evaluateTransaction(fcn, args);

        }
        console.log(result)
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        
        // Disconnect from the gateway
        await gateway.disconnect();

        result = JSON.parse(result.toString());

        return result
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return error.message

    }
}

// fuction for set status 'none' to order
const setstatusorder = async (message, status) => {
    for (let index = 0; index < message.length; index++) {
        message[index].Record.status = status;
       
   }

   return message;
}

// check status index page
const checkstatus = async (message1, message2, status) => {
    for (let l = 0; l < message2.length; l++) {
        for (let m = 0; m < message1.length; m++) {
            if (message1[m].Key === message2[l].Record.transOrderInfo && message1[m].Record.status === 'none') {
                message1[m].Record.status = status;
            } 
            
        }
        
    }

    return message1;
}

// check work for sub con (peer2)
const checksubowner = async (id, message1) => {
    let message = [];
    for (let index = 0; index < message1.length; index++) {
        if (message1[index].Record.subcontractID === id) {
            message.push(message1[index]);

        }
        
    }
    return message;
}

// check work for transpoter (peer3)
const assignment = async (transporter, truckid, myassign, subassign) => {
    let message = [];
    if (transporter === '') {
        for (let index = 0; index < myassign.length; index++) {
            if (truckid === myassign[index].Record.truckID) {
                message.push(myassign[index]);
            }
            
        }
    } else {
        for (let index = 0; index < subassign.length; index++) {
            if (truckid === subassign[index].Record.truckID) {
                message.push(subassign[index]);
            }
            
        }
    }
    return message;
}

// data transport
const statustransport = async (message, loading, delivery) => {
    for (let i1 = 0; i1 < message.length; i1++) {
        if (loading.length > 0) {
            for (let i2 = 0; i2 < loading.length; i2++) {
                if (loading[i2].Record.transOrderInfo === message[i1].Key) {
                 message[i1].Record.startmileageno = loading[i2].Record.startmileageno;
                 message[i1].Record.loadingend = true;
                 break;
                } else {
                    message[i1].Record.loadingend = false;
                }
                
            }
        } else {
            message[i1].Record.loadingend = false;
        }

        if (delivery.length > 0) {
            for (let i3 = 0; i3 < delivery.length; i3++) {
                if (delivery[i3].Record.transOrderInfo === message[i1].Key) {
                message[i1].Record.finishmileageno = delivery[i3].Record.finishmileageno;
                message[i1].Record.deliveryend = true;
                break;
            } else {
                message[i1].Record.deliveryend = false;
            }
            
        }
        } else {
            message[i1].Record.deliveryend = false;
        }
        
        
         
     }
     return message;
}

// check current work to do (peer3)
const cerrentdelivery = async (message) => {
    var current = {};
    for (let index = 0; index < message.length; index++) {
        if (message[index].Record.deliveryend === false) {
            current = message[index];
        }
        
    }
    return current;
}


exports.query = query;
exports.querybyid = querybyid;
exports.setstatusorder = setstatusorder;
exports.checkstatus = checkstatus;
exports.checksubowner = checksubowner;
exports.checkstatus = checkstatus;
exports.assignment = assignment;
exports.statustransport = statustransport;
exports.cerrentdelivery = cerrentdelivery;