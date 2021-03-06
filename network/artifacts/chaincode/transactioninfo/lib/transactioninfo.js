/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // Chaincode for order transaction info

'use strict';

const { Contract } = require('fabric-contract-api');

class Transactioninfo extends Contract {

    /********************************* query by id and all  *********************************/
    // query order by ID
    async queryTransaction(ctx, orderID) {
        const orderAsBtyes = await ctx.stub.getState(orderID); // get the car from chaincode state
        if (!orderAsBtyes || orderAsBtyes.length === 0) {
            throw new Error(`${orderID} does not exist`);
        }
        console.log(orderAsBtyes.toString());
        return orderAsBtyes.toString();
    }

    //query all transactions
    async queryAllTransactions(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }


    /********************************* orderinfo *********************************/

    // create order details (invoke by peer0 => customer services)
    async createTransaction(ctx, 
        // orderID, 
        cargoOwner,
        loadingPoint, 
        loadingDateTime, 
        deliveryPoint,
        deliveryDateTime, 
        productID, 
        quantity, 
        packingDim, 
        totalWeight,
        peer) {

        let tranID = 'TRAN' + Math.random().toString(36).substr(2, 9);
        let orderIDcheck;
        
        while (true) {
            orderIDcheck = await ctx.stub.getState(tranID); 
            if (!orderIDcheck || orderIDcheck.length === 0) {
                break;
            }
            tranID = 'TRAN' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer0") {
            const order = {orderinfo: {
                cargoOwner: cargoOwner,
                loadingPoint: loadingPoint,
                loadingDateTime: loadingDateTime,
                deliveryPoint: deliveryPoint,
                deliveryDateTime: deliveryDateTime,
                productID: productID,
                quantity: quantity,
                packingDim: packingDim,
                totalWeight: totalWeight,
                timeSave: Date.now(),
                }
                
            };
    
            await ctx.stub.putState(tranID, Buffer.from(JSON.stringify(order)));
            return [true, tranID];
        } else {
            return false;
        }
        
    }

    

    //change transaction data in database
    async changeDataTransaction(ctx, 
        transactionID, 
        cargoOwner,
        loadingPoint, 
        loadingDateTime, 
        deliveryPoint,
        deliveryDateTime, 
        productID, 
        quantity, 
        packingDim, 
        totalWeight,
        peer) {

        
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);
        
        if (peer == "peer0") {
            record.orderinfo = {
                cargoOwner: cargoOwner,
                loadingPoint: loadingPoint,
                loadingDateTime: loadingDateTime,
                deliveryPoint: deliveryPoint,
                deliveryDateTime: deliveryDateTime,
                productID: productID,
                quantity: quantity,
                packingDim: packingDim,
                totalWeight: totalWeight,
                timeSave: Date.now(),
                };
                
    
            await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
            return [true, transactionID];
        } else {
            return false;
        }

    }

    // delete transaction
    async deleteTransaction(ctx, transactionID, peer) {
        if (peer == "peer0") {
            try {
                ctx.stub.deleteState(transactionID);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
            
        } else {
            return false;
        }
    }


    /********************************* myjobinfo *********************************/

    // create jobassign details (invoke by peer1 => transportation)
    async createJobAssignmentInfo(ctx, 
        transactionID, 
        truckID,
        peer) {

            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer == "peer1") {
                record.myjobassignment = {
                    truckID: truckID,
                    timeSave: Date.now(),
                };
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
        
    }

    async deleteJobAssignmentInfo(ctx,
        transactionID,
        peer) {
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer ==  "peer1") {

                delete record.myjobassignment;
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
    }



        /********************************* workinfo *********************************/

    // create workinfo details (invoke by peer1 => transportation)
    async createWorkInfo(ctx, 
        transactionID, 
        subcontractID,
        peer) {

            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer == "peer1") {
                record.workinfo = {
                    subcontractID: subcontractID,
                    timeSave: Date.now(),
                };
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
        
    }

    async deleteWorkInfo(ctx,
        transactionID,
        peer) {
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer ==  "peer1") {

                delete record.workinfo;
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
    }


        /********************************* subjobassignment *********************************/

    // create subjobassignment details (invoke by peer2 => subcon)
    async createSubJobAssignment(ctx, 
        transactionID, 
        truckID,
        peer) {

            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer == "peer2") {
                record.subjobassignment = {
                    truckID: truckID,
                    timeSave: Date.now(),
                };
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
        
    }

    async deleteSubJobAssignment(ctx,
        transactionID,
        peer) {
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer ==  "peer2") {

                delete record.subjobassignment;
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
    }
    

        /********************************* loading *********************************/

    // create loading details (invoke by peer3 => transporter)
    async createLoadingInfo(ctx, 
        transactionID, 
        startmileageno, 
        loadingend,
        peer) {

            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer == "peer3") {
                record.loadinginfo = {
                    startmileageno: startmileageno,
                    loadingend: loadingend,
                    timeSave: Date.now(),
                };
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
        
    }

    async deleteLoadingInfo(ctx,
        transactionID,
        peer) {
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer ==  "peer3") {

                delete record.loadinginfo;
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
    }


        /********************************* delivery *********************************/

    // create delivery details (invoke by peer3 => transporter)
    async createDeliveryInfo(ctx, 
        transactionID, 
        finishmileageno, 
        deliveryend,
        peer) {

            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer == "peer3") {
                record.deliveryinfo = {
                    finishmileageno: finishmileageno,
                    deliveryend: deliveryend,
                    timeSave: Date.now(),
                };
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
        
    }

    async deleteDeliveryInfo(ctx,
        transactionID,
        peer) {
            const tranAsBtyes = await ctx.stub.getState(transactionID); // get the car from chaincode state
            if (!tranAsBtyes || tranAsBtyes.length === 0) {
                throw new Error(`${transactionID} does not exist`);
            }
            console.log(tranAsBtyes.toString());
            var record = tranAsBtyes.toString();
            record = JSON.parse(record);

            if (peer ==  "peer3") {

                delete record.deliveryinfo;
                    
                await ctx.stub.putState(transactionID, Buffer.from(JSON.stringify(record)));
                return [true, transactionID];
            } else {
                return false;
            }
    }

}

module.exports = Transactioninfo;
