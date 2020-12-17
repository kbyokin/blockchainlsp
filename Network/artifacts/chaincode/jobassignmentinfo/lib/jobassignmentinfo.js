/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

 // chaincode for work

'use strict';

const { Contract } = require('fabric-contract-api');

class Jobassignmentinfo extends Contract {


    // query job info by id 
    async queryJobassignInfo(ctx, JobIDSub) {
        const JobSubAsBtyes = await ctx.stub.getState(JobIDSub); // get the car from chaincode state
        if (!JobSubAsBtyes || JobSubAsBtyes.length === 0) {
            throw new Error(`${JobIDSub} does not exist`);
        }
        console.log(JobSubAsBtyes.toString());
        return JobSubAsBtyes.toString();
    }

    //query all job
    async queryAllJobAssignmentInfo(ctx) {
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


    // create job
    async createJobAssignmentInfo(ctx, 
        workOrderInfo,
        transOrderInfo, 
        truckID,
        peer) {

        let jobID = 'JOB' + Math.random().toString(36).substr(2, 9);
        let jobIDcheck;

        while (true) {
            jobIDcheck = await ctx.stub.getState(jobID); 
            if (!jobIDcheck || jobIDcheck.length === 0) {
                break;
            }
            jobID = 'JOB' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer1" || peer == "peer2") {
            const Job = {
                jobID,
                workOrderInfo,
                transOrderInfo, 
                truckID,
            };
    
            await ctx.stub.putState(jobID, Buffer.from(JSON.stringify(Job)));
            return [true, jobID];
        } else {
            return false;
        }
        
    }

    //change job data in database
    async changeDataJobAssignment(ctx, 
        jobID,
        workOrderInfo,
        transOrderInfo, 
        truckID,
        peer) {

        
        if (peer == "peer1" || peer == "peer2") {
            const Job = {
                jobID,
                workOrderInfo,
                transOrderInfo, 
                truckID,
            };
    
            await ctx.stub.putState(jobID, Buffer.from(JSON.stringify(Job)));

            return [true, jobID];
        } else {
           return false;
        }

    }

    // delete work
    async deleteJobAssignment(ctx, jobID, peer) {
        if (peer == "peer1" || peer == "peer2") {
            try {
                ctx.stub.deleteState(jobID);
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

module.exports = Jobassignmentinfo;
