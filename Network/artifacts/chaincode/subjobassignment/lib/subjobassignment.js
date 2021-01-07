/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // Chaincode for order transaction info

'use strict';

const { Contract } = require('fabric-contract-api');

class Subjobassignment extends Contract {

    // query order by ID
    async querysubjobassignment(ctx, subjobID) {
        const subjobAsBtyes = await ctx.stub.getState(subjobID); // get the car from chaincode state
        if (!subjobAsBtyes || subjobAsBtyes.length === 0) {
            throw new Error(`${subjobID} does not exist`);
        }
        console.log(subjobAsBtyes.toString());
        return subjobAsBtyes.toString();
    }

    // create order details (invoke by peer0 => customer services)
    async createsubjobassignment(ctx, 
        // subjobID, 
        workOrderInfo,
        transOrderInfo, 
        truckID,
        peer) {

        let subjobID = 'SUBJOB' + Math.random().toString(36).substr(2, 9);
        let subjobIDcheck;
        
        while (true) {
            subjobIDcheck = await ctx.stub.getState(subjobID); 
            if (!subjobIDcheck || subjobIDcheck.length === 0) {
                break;
            }
            subjobID = 'SUBJOB' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer2") {
            const subjob = {
                subjobID,
                workOrderInfo,
                transOrderInfo, 
                truckID,
            };
    
            await ctx.stub.putState(subjobID, Buffer.from(JSON.stringify(subjob)));
            return [true, subjobID];
        } else {
            return false;
        }
        
    }

    //query all transactions
    async queryAllsubjobassignment(ctx) {
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

    //change transaction data in database
    async changeDatasubjobassignment(ctx, 
        subjobID,
        workOrderInfo,
        transOrderInfo, 
        truckID,
        peer) {

        
        if (peer == "peer2") {
            const subjob = {
                subjobID,
                workOrderInfo,
                transOrderInfo, 
                truckID,
            };
    
            await ctx.stub.putState(subjobID, Buffer.from(JSON.stringify(subjob)));
            return [true, subjobID];
        } else {
            return false;
        }

    }

    // delete transaction
    async deletesubjobassignment(ctx, subjobID, peer) {
        if (peer == "peer2") {
            try {
                ctx.stub.deleteState(subjobID);
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
            
        } else {
            return false;
        }
    }

}

module.exports = Subjobassignment;
