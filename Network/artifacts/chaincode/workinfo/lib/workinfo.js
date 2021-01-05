/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // chaincode for work

'use strict';

const { Contract } = require('fabric-contract-api');

class Workinfo extends Contract {

    // query work info by id 
    async queryWorkOrderInfo(ctx, WorkID) {
        const WorkAsBtyes = await ctx.stub.getState(WorkID); // get from chaincode state
        if (!WorkAsBtyes || WorkAsBtyes.length === 0) {
            throw new Error(`${WordID} does not exist`);
        }
        console.log(WorkAsBtyes.toString());
        return WorkAsBtyes.toString();
    }

    //query all work
    async queryAllWork(ctx) {
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


    // create work
    async WorkOrderInfoCreate(ctx, 
        transOrderInfo,
        subcontractID,
        peer) {

        let WorkID = 'WORK' + Math.random().toString(36).substr(2, 9);
        let workIDcheck;

        while (true) {
            workIDcheck = await ctx.stub.getState(WorkID); 
            if (!workIDcheck || workIDcheck.length === 0) {
                break;
            }
            WorkID = 'WORK' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer1") {
            const Work = {
                WorkID, 
                transOrderInfo,
                subcontractID,
            };
    
            await ctx.stub.putState(WorkID, Buffer.from(JSON.stringify(Work)));
            return [true, WorkID];
        } else {
            return false;
        }
        
    }

    //change work data in database
    async changeDataWork(ctx, 
        workID,
        transOrderInfo,
        subcontractID,
        peer) {

        
        if (peer == "peer1") {
            const work = {
                workID,
                transOrderInfo,
                subcontractID,
            };
    
            await ctx.stub.putState(workID, Buffer.from(JSON.stringify(work)));

            return [true, workID];
        } else {
            return false;
        }

    }

    // delete work
    async deleteWork(ctx, workID, peer) {
        if (peer == "peer1") {
            try {
                ctx.stub.deleteState(workID);
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

module.exports = Workinfo;
