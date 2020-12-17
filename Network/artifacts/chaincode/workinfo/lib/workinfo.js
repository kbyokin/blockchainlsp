/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // chaincode for work

'use strict';

const { Contract } = require('fabric-contract-api');

class Workinfo extends Contract {

    // async queryJobassignment(ctx, JobID) {
    //     const JobAsBtyes = await ctx.stub.getState(JobID); // get from chaincode state
    //     if (!JobAsBtyes || JobAsBtyes.length === 0) {
    //         throw new Error(`${JobID} does not exist`);
    //     }
    //     console.log(JobAsBtyes.toString());
    //     return JobAsBtyes.toString();
    // }

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

    // create work
    async WorkOrderInfoCreate(ctx, 
        TransOrderInfoID,
        WorkTruckID,
        peer) {

        let WorkID = 'Work' + Math.random().toString(36).substr(2, 9);
        let workIDcheck;

        while (true) {
            workIDcheck = await ctx.stub.getState(WorkID); 
            if (!workIDcheck || workIDcheck.length === 0) {
                break;
            }
            WorkID = 'Work' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer1") {
            const Work = {
                WorkID, 
                TransOrderInfoID,
                WorkTruckID,
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
        TransOrderInfoID,
        WorkTruckID,
        peer) {

        
        if (peer == "peer1") {
            const work = {
                workID,
                TransOrderInfoID,
                WorkTruckID,
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

    // async queryAllJobassignmentInfo(ctx) {
    //     const startKey = '';
    //     const endKey = '';
    //     const allResults = [];
    //     for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
    //         const strValue = Buffer.from(value).toString('utf8');
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push({ Key: key, Record: record });
    //     }
    //     console.info(allResults);
    //     return JSON.stringify(allResults);
    // }

    // async changeTransOrderInfo(ctx, JobID, newTransOrderInfo) {
    //     console.info('============= START : changeTransOrderInfo ===========');

    //     const orderAsBtyes = await ctx.stub.getState(JobID); // get the transaction from chaincode state
    //     if (!orderAsBtyes || orderAsBtyes.length === 0) {
    //         throw new Error(`${JobID} does not exist`);
    //     }
    //     const Job = JSON.parse(orderAsBtyes.toString());
    //     Job.TransOrderInfo = newTransOrderInfo;

    //     await ctx.stub.putState(JobID, Buffer.from(JSON.stringify(Job)));
    //     console.info('============= END : changeCargoOwner ===========');
    // }

}

module.exports = Workinfo;
