/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class LSP extends Contract {

    // query order by ID
    async queryTransaction(ctx, orderID) {
        const orderAsBtyes = await ctx.stub.getState(orderID); // get the car from chaincode state
        if (!orderAsBtyes || orderAsBtyes.length === 0) {
            throw new Error(`${orderID} does not exist`);
        }
        console.log(orderAsBtyes.toString());
        return orderAsBtyes.toString();
    }

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
        console.info('============= START : Create Transaction Order Info ===========');

        let result;
        let orderID = 'ORDER' + Math.random().toString(36).substr(2, 9);
        let orderIDcheck;
        
        while (true) {
            orderIDcheck = await ctx.stub.getState(orderID); 
            if (!orderIDcheck || orderIDcheck.length === 0) {
                break;
            }
            orderID = 'ORDER' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer0") {
            const order = {
                orderID,
                cargoOwner,
                loadingPoint,
                loadingDateTime,
                deliveryPoint,
                deliveryDateTime,
                productID,
                quantity,
                packingDim,
                totalWeight,
            };
    
            await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(order)));
            console.info('============= END : Create Transaction Order Info ===========');
            result = true;
            return [result, orderID];
        } else {
            result = false;
            return result;
        }
        
    }

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

    // async changeDataTransaction(ctx, 
    //     orderID, 
    //     cargoOwner,
    //     loadingPoint, 
    //     loadingDateTime, 
    //     deliveryPoint,
    //     deliveryDateTime, 
    //     productID, 
    //     quantity, 
    //     packingDim, 
    //     totalWeight,
    //     peer) {
    //     console.info('============= START : changeCargoOwner ===========');

    //     let result;
        
    //     if (peer == "peer0") {
    //         const order = {
    //             orderID,
    //             cargoOwner,
    //             loadingPoint,
    //             loadingDateTime,
    //             deliveryPoint,
    //             deliveryDateTime,
    //             productID,
    //             quantity,
    //             packingDim,
    //             totalWeight,
    //         };
    
    //         await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(order)));
    //         console.info('============= END : Create Transaction Order Info ===========');
    //         result = true;
    //     } else {
    //         result = false;
    //     }
    //     return result;

    //     // const orderAsBtyes = await ctx.stub.getState(orderID); // get the transaction from chaincode state
    //     // if (!orderAsBtyes || orderAsBtyes.length === 0) {
    //     //     throw new Error(`${orderID} does not exist`);
    //     // }
    //     // const order = JSON.parse(orderAsBtyes.toString());
    //     // order.cargoOwner = newOwner;

    //     // await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(order)));
    //     // console.info('============= END : changeCargoOwner ===========');
    // }

}

module.exports = LSP;
