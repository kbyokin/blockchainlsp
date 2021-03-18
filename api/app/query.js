const { Gateway, Wallets, } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')


const helper = require('./helper')

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

        if (fcn == "queryAllTransactions") {
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


// check status index page
const checkstatus = async (message, peer) => {
    if (peer == "peer2") {
        for (let index = 0; index < message.length; index++) {
            if (typeof(message[index].Record.deliveryinfo) != "undefined") {
                message[index].status = 'delivery';
            } else if (typeof(message[index].Record.loadinginfo) != "undefined"){
                message[index].status = 'loading';
            } else if (typeof(message[index].Record.subjobassignment) != "undefined"){
                message[index].status = 'assign';
            } else {
                message[index].status = 'none';
            }
        }
    } else if (peer == "peer3") {
        for (let index = 0; index < message.length; index++) {
            if (typeof(message[index].Record.deliveryinfo) != "undefined") {
                message[index].status = 'delivery';
            } else if (typeof(message[index].Record.loadinginfo) != "undefined"){
                message[index].status = 'loading';
            } else {
                message[index].status = 'none';
            }
        }
    } else {
        for (let index = 0; index < message.length; index++) {
            if (typeof(message[index].Record.deliveryinfo) != "undefined") {
                message[index].status = 'delivery';
            } else if (typeof(message[index].Record.loadinginfo) != "undefined"){
                message[index].status = 'loading';
            } else if (typeof(message[index].Record.subjobassignment) != "undefined"){
                message[index].status = 'contractassign';
            } else if (typeof(message[index].Record.workinfo) != "undefined"){
                message[index].status = 'worktocontract';
            } else if (typeof(message[index].Record.myjobassignment) != "undefined"){
                message[index].status = 'myassign';
            } else {
                message[index].status = 'none';
            }
        }
    }
    

    return message;
}

// query work for peer2
const queryworkpeer2 = async (message, subconID) => {
    let result = [];
    for (let index = 0; index < message.length; index++) {
        if (typeof(message[index].Record.workinfo) != "undefined" && message[index].Record.workinfo.subcontractID == subconID) {
            result.push(message[index]);
        }
        
    }
    return result;
}

// query all work for peer3
const queryallworktruck = async (message, truckid) => {
    let result = [];
    for (let index = 0; index < message.length; index++) {
        if (typeof(message[index].Record.myjobassignment) != "undefined" && message[index].Record.myjobassignment.truckID == truckid) {
            result.push(message[index]);
        } else if (typeof(message[index].Record.subjobassignment) != "undefined" && message[index].Record.subjobassignment.truckID == truckid) {
            result.push(message[index]);
        }
    }
    return result;
}

// query current work for peer3
const querycurrentworktruck = async (result) => {
    let current = {};
    for (let index = 0; index < result.length; index++) {
        if (typeof(result[index].Record.loadinginfo) == "undefined" || typeof(result[index].Record.deliveryinfo) == "undefined") {
            current = result[index];
        }
        
    }
    return current;
}

// query all work have to do work for peer3
const queryallworkhavetodotruck = async (result) => {
    let workHaveToDo = [];
    for (let index = 0; index < result.length; index++) {
        if (typeof(result[index].Record.loadinginfo) == "undefined" || typeof(result[index].Record.deliveryinfo) == "undefined") {
            workHaveToDo.push(result[index]);
        }
        
    }
    return workHaveToDo;
}



exports.query = query;
exports.querybyid = querybyid;
exports.checkstatus = checkstatus;
exports.queryworkpeer2 = queryworkpeer2;
exports.queryallworktruck = queryallworktruck;
exports.querycurrentworktruck = querycurrentworktruck;
exports.queryallworkhavetodotruck = queryallworkhavetodotruck;