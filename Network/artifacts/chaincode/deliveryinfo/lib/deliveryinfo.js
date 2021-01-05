/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // Chaincode for order transaction info

 'use strict';

 const { Contract } = require('fabric-contract-api');
 
 class DeliveryInfo extends Contract {
 
     // query Delivery by ID
     async queryDeliveryinfo(ctx, deliveryID) {
        const deliveryAsBtyes = await ctx.stub.getState(deliveryID); // get the car from chaincode state
        if (!deliveryAsBtyes || deliveryAsBtyes.length === 0) {
            throw new Error(`${deliveryID} does not exist`);
        }
        console.log(deliveryAsBtyes.toString());
        return deliveryAsBtyes.toString();
    }
     
    async createdeliveryinfo(ctx, 
        // deliveryID, 
        transOrderInfo,
        jobassigninfo,
        finishmileageno, 
        deliveryend,
        peer) {
        
        let deliveryID = 'DELIVERY' + Math.random().toString(36).substr(2, 9);
        let deliveryIDcheck;
        
        while (true) {
            deliveryIDcheck = await ctx.stub.getState(deliveryID); 
            if (!deliveryIDcheck || deliveryIDcheck.length === 0) {
                break;
            }
            deliveryID = 'DELIVERY' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer3") {
            const delivery = {
                deliveryID,
                transOrderInfo,
                jobassigninfo,
                finishmileageno, 
                deliveryend,
            };
    
            await ctx.stub.putState(deliveryID, Buffer.from(JSON.stringify(delivery)));
            return [true, deliveryID];
        } else {
            return false;
        }

    }
 
     
     async queryAlldeliveryinfo(ctx) {
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
     async changeDatadeliveryinfo(ctx, 
         deliveryID, 
         transOrderInfo,
         jobassigninfo,
         finishmileageno, 
         deliveryend,
         peer) {
 
         
         if (peer == "peer3") {
             const delivery = {
                deliveryID, 
                transOrderInfo,
                jobassigninfo,
                finishmileageno, 
                deliveryend,
             };
     
             await ctx.stub.putState(deliveryID, Buffer.from(JSON.stringify(delivery)));
             return [true, deliveryID];
         } else {
             return false;
         }
 
     }
 
     // delete transaction
     async deleteDatadeliveryinfo(ctx, deliveryID, peer) {
         if (peer == "peer3") {
             try {
                 ctx.stub.deleteState(deliveryID);
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
 
 module.exports = DeliveryInfo;
 