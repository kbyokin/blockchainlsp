/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class LSP2 extends Contract {

    // async initLedger(ctx) {
    //     console.info('============= START : Initialize Ledger ===========');
    //     const cars = [
    //         {
    //             color: 'blue',
    //             make: 'Toyota',
    //             model: 'Prius',
    //             owner: 'Tomoko',
    //         },
    //         {
    //             color: 'red',
    //             make: 'Ford',
    //             model: 'Mustang',
    //             owner: 'Brad',
    //         },
    //         {
    //             color: 'green',
    //             make: 'Hyundai',
    //             model: 'Tucson',
    //             owner: 'Jin Soo',
    //         },
    //         {
    //             color: 'yellow',
    //             make: 'Volkswagen',
    //             model: 'Passat',
    //             owner: 'Max',
    //         },
    //         {
    //             color: 'black',
    //             make: 'Tesla',
    //             model: 'S',
    //             owner: 'Adriana',
    //         },
    //         {
    //             color: 'purple',
    //             make: 'Peugeot',
    //             model: '205',
    //             owner: 'Michel',
    //         },
    //         {
    //             color: 'white',
    //             make: 'Chery',
    //             model: 'S22L',
    //             owner: 'Aarav',
    //         },
    //         {
    //             color: 'violet',
    //             make: 'Fiat',
    //             model: 'Punto',
    //             owner: 'Pari',
    //         },
    //         {
    //             color: 'indigo',
    //             make: 'Tata',
    //             model: 'Nano',
    //             owner: 'Valeria',
    //         },
    //         {
    //             color: 'brown',
    //             make: 'Holden',
    //             model: 'Barina',
    //             owner: 'Shotaro',
    //         },
    //     ];

    //     for (let i = 0; i < cars.length; i++) {
    //         cars[i].docType = 'car';
    //         await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
    //         console.info('Added <--> ', cars[i]);
    //     }
    //     console.info('============= END : Initialize Ledger ===========');
    // }


    async queryJobassignment(ctx, JobID) {
        const JobAsBtyes = await ctx.stub.getState(JobID); // get the car from chaincode state
        if (!JobAsBtyes || JobAsBtyes.length === 0) {
            throw new Error(`${JobID} does not exist`);
        }
        console.log(JobAsBtyes.toString());
        return JobAsBtyes.toString();
    }

    async queryWorkOrderInfo(ctx, WorkID) {
        const WorkAsBtyes = await ctx.stub.getState(WorkID); // get the car from chaincode state
        if (!WorkAsBtyes || WorkAsBtyes.length === 0) {
            throw new Error(`${WordID} does not exist`);
        }
        console.log(WorkAsBtyes.toString());
        return WorkAsBtyes.toString();
    }

    // async createTransaction(ctx, 
    //     orderID, 
    //     cargoOwner,
    //     loadingPoint, 
    //     loadingDateTime, 
    //     deliveryPoint,
    //     deliveryDateTime, 
    //     productID, 
    //     quantity, 
    //     packingDim, 
    //     totalWeight) {
    //     console.info('============= START : Create Transaction Order Info ===========');

    //     const order = {
    //         orderID,
    //         cargoOwner,
    //         loadingPoint,
    //         loadingDateTime,
    //         deliveryPoint,
    //         deliveryDateTime,
    //         productID,
    //         quantity,
    //         packingDim,
    //         totalWeight,
    //         // color,
    //         // docType: 'car',
    //         // make,
    //         // model,
    //         // owner,
    //     };

    //     await ctx.stub.putState(orderID, Buffer.from(JSON.stringify(order)));
    //     console.info('============= END : Create Transaction Order Info ===========');
    // }

    async JobassignmentInfo(ctx, 
        JobID, 
        JobTransOrderInfo,
        JobTruckID) {
        console.info('============= START : Create Job Assignment Info ===========');

        const Job = {
            JobID, 
            JobTransOrderInfo,
            JobTruckID,
        };

        await ctx.stub.putState(JobID, Buffer.from(JSON.stringify(Job)));
        console.info('============= END : Create Transaction Order Info ===========');
    }

    async WorkOrderInfo(ctx, 
        WorkID, 
        WorkTransOrderInfo,
        WorkTruckID) {
        console.info('============= START : Create Work Order Info ===========');

        const Job = {
            WorkID, 
            WorkTransOrderInfo,
            WorkTruckID,
        };

        await ctx.stub.putState(WorkID, Buffer.from(JSON.stringify(Job)));
        console.info('============= END : Create Transaction Order Info ===========');
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
