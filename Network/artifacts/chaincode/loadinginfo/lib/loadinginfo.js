/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Loadinginfo extends Contract {

    async queryLoadinginfo(ctx, loadingID) {
        const loadingAsBtyes = await ctx.stub.getState(loadingID); 
        if (!loadingAsBtyes || loadingAsBtyes.length === 0) {
            throw new Error(`${loadingID} does not exist`);
        }
        console.log(loadingAsBtyes.toString());
        return loadingAsBtyes.toString();
    }
    
    async createloadinginfo(ctx, 
        // loadingID, 
        jobassigninfo,
        startmileageno, 
        loadingend,
        peer) {
        
        
        let loadingID = 'Load' + Math.random().toString(36).substr(2, 9);
        let loadingIDcheck;
        
        while (true) {
            loadingIDcheck = await ctx.stub.getState(loadingID); 
            if (!loadingIDcheck || loadingIDcheck.length === 0) {
                break;
            }
            loadingID = 'Load' + Math.random().toString(36).substr(2, 9);
        }

        if (peer == "peer3") {
            const loading = {
                loadingID,
                jobassigninfo,
                startmileageno, 
                loadingend,
            };
    
            await ctx.stub.putState(loadingID, Buffer.from(JSON.stringify(loading)));
            return [true, loadingID];
        } else {
            return false;
        }
    }

    

    async queryAllloadingInfo(ctx) {
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
    async changeDataloadinginfo(ctx, 
        loadingID,
        jobassigninfo,
        startmileageno, 
        loadingend,
        peer) {

        
        if (peer == "peer3") {
            const loading = {
                loadingID,
                jobassigninfo,
                startmileageno, 
                loadingend,
            };
    
            await ctx.stub.putState(loadingID, Buffer.from(JSON.stringify(loading)));
            return [true, loadingID];
        } else {
            return false;
        }

    }

    // delete transaction
    async deleteDataloadinginfo(ctx, loadingID, peer) {
        if (peer == "peer3") {
            try {
                ctx.stub.deleteState(loadingID);
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

module.exports = Loadinginfo;
