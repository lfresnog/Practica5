import {ObjectID} from 'mongodb';

const Mutation = {
    addTeam: async (parent, args, ctx, info) => {
        const {client} = ctx;
        
        const db = client.db("football");
        const teamsCollection = db.collection("teams");
        
        const founded = await teamsCollection.findOne({name: args.name});
        if(founded) throw new Error("The team already exists");
        const inserted = await teamsCollection.insertOne({name: args.name});

        return inserted.ops[0];
    },
    addMatch: async (parent, args, ctx, info) => {
        const {client} = ctx;
        const {local,visitor,date,score,play,end} = args;

        const db = client.db("football");
        const teamsCollection = db.collection("teams");
        const matchsCollection = db.collection("matchs");

        const localFound = await teamsCollection.findOne({_id: ObjectID(local)});
        if(!localFound) throw new Error("Local team not found");
        const visitorFound = await teamsCollection.findOne({_id: ObjectID(visitor)});
        if(!visitorFound) throw new Error("Visitor team not found");

        const inserted = await matchsCollection.insertOne({local,visitor,date,score,play,end});

        return inserted.ops[0];
    },
    updateScore: async (parent,args,ctx,info) => {
        const {client,pubsub} = ctx;
        const {match,score} = args;

        const db = client.db("football");
        const matchsCollection = db.collection("matchs");

        const updated = await matchsCollection.findOneAndUpdate(
            {_id:ObjectID(match),play:true},
            {$set:{score}},
            {returnOriginal: false}
        );
        if(!updated.value) throw new Error("Match not found or not started");

        pubsub.publish(match,{tellMe: `NEW SCORE: ${score}`});
        pubsub.publish(updated.value.local,{tellMe: `NEW SCORE: ${score}`});
        pubsub.publish(updated.value.visitor,{tellMe: `NEW SCORE: ${score}`});

        return updated.value; 
    },
    startEnd: async (parent,args,ctx,info) => {
        const {client,pubsub} = ctx;
        const {match,play,end} = args;

        const db = client.db("football");
        const matchsCollection = db.collection("matchs");

        const found = await matchsCollection.findOne({_id:ObjectID(match)});
        if(!found) throw new Error("Match not found");

        if(found.play == false && found.end == false){
            const updated = await matchsCollection.findOneAndUpdate(
                {_id:ObjectID(match)},
                {$set:{play}},
                {returnOriginal: false}
            ); 

            pubsub.publish(match,{tellMe: `The match has STARTED`});
            pubsub.publish(updated.value.local,{tellMe: `The match has STARTED`});
            pubsub.publish(updated.value.visitor,{tellMe: `The match has STARTED`});

            return updated.value; 
        }

        else if(found.play == true && found.end == false){
            const updated = await matchsCollection.findOneAndUpdate(
                {_id:ObjectID(match)},
                {$set:{play:false,end}},
                {returnOriginal: false}
            ); 

            pubsub.publish(match,{tellMe: `The match has FINISHED ${updated.value.score}`});
            pubsub.publish(updated.value.local,{tellMe: `The match has FINISHED ${updated.value.score}`});
            pubsub.publish(updated.value.visitor,{tellMe: `The match has FINISHED ${updated.value.score}`});

            return updated.value; 
        }
        throw new Error("ERROR");
    },
    tellYou: (parent,args,ctx,info) => {
        const {id,value} = args;
        const {pubsub} = ctx;

        pubsub.publish(id,{tellMe: value});

        return value;
    }
}

export {Mutation as default};