/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class LSP2 extends Contract {

    // async queryJobassignment(ctx, JobID) {
    //     const JobAsBtyes = await ctx.stub.getState(JobID); // get from chaincode state
    //     if (!JobAsBtyes || JobAsBtyes.length === 0) {
    //         throw new Error(`${JobID} does not exist`);
    //     }
    //     console.log(JobAsBtyes.toString());
    //     return JobAsBtyes.toString();
    // }

    async queryWorkOrderInfo(ctx, WorkID) {
        const WorkAsBtyes = await ctx.stub.getState(WorkID); // get from chaincode state
        if (!WorkAsBtyes || WorkAsBtyes.length === 0) {
            throw new Error(`${WordID} does not exist`);
        }
        console.log(WorkAsBtyes.toString());
        return WorkAsBtyes.toString();
    }

    // async JobassignmentInfo(ctx, 
    //     JobID, 
    //     JobTransOrderInfo,
    //     JobTruckID) {
    //     console.info('============= START : Create Job Assignment Info ===========');

    //     const Job = {
    //         JobID, 
    //         JobTransOrderInfo,
    //         JobTruckID,
    //     };

    //     await ctx.stub.putState(JobID, Buffer.from(JSON.stringify(Job)));
    //     console.info('============= END : Create Transaction Order Info ===========');
    // }

    async WorkOrderInfoCreate(ctx, 
        WorkID, 
        TransOrderInfoID,
        WorkTruckID,
        peer) {
        console.info('============= START : Create Work Order Info ===========');

        let result;
        if (peer == "peer1") {
            const Work = {
                WorkID, 
                TransOrderInfoID,
                WorkTruckID,
            };
    
            await ctx.stub.putState(WorkID, Buffer.from(JSON.stringify(Work)));
            console.info('============= END : Create Transaction Order Info ===========');
            result = true;
        } else {
            result = false;
        }
        return result;
        
    }

    async queryAllJobassignmentInfo(ctx) {
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

    async changeTransOrderInfo(ctx, JobID, newTransOrderInfo) {
        console.info('============= START : changeTransOrderInfo ===========');

        const orderAsBtyes = await ctx.stub.getState(JobID); // get the transaction from chaincode state
        if (!orderAsBtyes || orderAsBtyes.length === 0) {
            throw new Error(`${JobID} does not exist`);
        }
        const Job = JSON.parse(orderAsBtyes.toString());
        Job.TransOrderInfo = newTransOrderInfo;

        await ctx.stub.putState(JobID, Buffer.from(JSON.stringify(Job)));
        console.info('============= END : changeCargoOwner ===========');
    }

}

module.exports = LSP2;
