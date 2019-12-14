import {ObjectID} from 'mongodb';

const Match = {
    local: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {local} = parent;

        const db = client.db("football");
        const teamscollection = db.collection("teams");
        const teamFound = await teamscollection.findOne({_id:ObjectID(local)});
        if(!teamFound) throw new Error("Unexpected error");

        return teamFound;
    },
    visitor: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {visitor} = parent;

        const db = client.db("football");
        const matchscollection = db.collection("teams");
        const teamFound = await matchscollection.findOne({_id:ObjectID(visitor)});
        if(!teamFound){
            throw new Error("Unexpected error");
        }
        return teamFound;
    } 
}

export {Match as default};