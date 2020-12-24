const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')

const helper = require('./helper')

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, peer) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        // const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(peer) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(peer) //path.join(process.cwd(), 'wallet');
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

        

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
            // transaction: {
            //     strategy: createTransactionEventhandler()
            // }
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        let result
        let message;
        // Order
        if (fcn === "createTransaction") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], peer);
            message = `Successfully added Order with key ${args[0]}`

        } else if (fcn === "changeDataTransaction") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], peer);
            message = `Successfully change Order with key ${args[0]}`
        
        } else if (fcn === "deleteTransaction") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Order with key ${args}`

        }
        // work assign 
        else if (fcn === "WorkOrderInfoCreate") {
            result = await contract.submitTransaction(fcn, args[0], args[1], peer);
            message = `Successfully added Work with key ${args[0]}`
        
        } else if (fcn === "changeDataWork") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], peer);
            message = `Successfully change Work with key ${args[0]}`
        
        } else if (fcn === "deleteWork") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Work with key ${args}`
            
        }
        // myjob assign
        else if (fcn == "createJobAssignmentInfo") {
            result = await contract.submitTransaction(fcn, args[0], args[1], peer);
            message = `Successfully added Myjob with key ${args[0]}`  
            
        } else if (fcn === "changeDataJobAssignment") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], peer);
            message = `Successfully change Myjob with key ${args[0]}`
        
        } else if (fcn === "deleteJobAssignment") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Myjob with key ${args}`
            
        }
        // subjob assign
        else if (fcn == "createsubjobassignment") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], peer);
            message = `Successfully added Subjob with key ${args[0]}`
        
        } else if (fcn === "changeDatasubjobassignment") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], peer);
            message = `Successfully change Subjob with key ${args[0]}`
        
        } else if (fcn === "deletesubjobassignment") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Subjob with key ${args}`
            
        }
        // loading 
        else if (fcn == "createloadinginfo") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], peer);
            message = `Successfully added Loading with key ${args[0]}`
            
        } else if (fcn === "changeDataloadinginfo") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], peer);
            message = `Successfully change Loading with key ${args[0]}`
        
        } else if (fcn === "deleteDataloadinginfo") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Loading with key ${args}`
            
        }
        // delivery
        else if (fcn == "createdeliveryinfo") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], peer);
            message = `Successfully added Delivery with key ${args[0]}`

        } else if (fcn === "changeDatadeliveryinfo") {
            result = await contract.submitTransaction(fcn, args[0], args[1], args[2], args[3], peer);
            message = `Successfully change Delivery with key ${args[0]}`
        
        } else if (fcn === "deleteDatadeliveryinfo") {
            result = await contract.submitTransaction(fcn, args, peer);
            message = `Successfully delete Delivery with key ${args}`
            
        }
        else {
            return `${fcn} is not function in chaincode ${chaincodeName}`
        }

        await gateway.disconnect();

        result = await JSON.parse(result.toString());


        if (result === false) {
            message = "Don't have permission."
        } 

        let response = {
            message: message,
            result: result
        }

        console.log(response);

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}

exports.invokeTransaction = invokeTransaction;