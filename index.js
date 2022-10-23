const {MongoClient} = require("mongodb")

async function main(){
    const url = "mongodb+srv://shubham96:LmI1SlH9UGdsZLB9@node-rest-shop.y4iyz79.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(url);


    try{
        await client.connect();
        // await listDatabases(client);

        //--------------Creating listings 
        // await createListing(client,{
        //     name:"shubhamHouse",
        //     summary:" a peak of house",
        //     beadroom:1,
        //     bathroom:2
        // });

        //----------creating multiple listing -=------
        // await createMultipleListing(client,[{
        //     name:"shubhamHouse",
        //     summary:" a peak of house",
        //     beadroom:1,
        //     bathroom:2
        // },{
        //     name:"rahul",
        //     summary:"targarean House",
        //     beadroom:3,
        //     bathroom:4 
        // }])

        //------------ reading the data from collection

        // await findOneListing(client,"rahul");

        //--------------reading multple data in collection usind read funtion 
        
        // await findListingWithBathroomBedRoomAndWithreviews(client,{
        //     minimumnumberofBathroom:1,
        //     minimumnumberOfBedRooms:1,
        //     maxmimumNumberOfResult:5
        // });

        // updatting the data from the collection 

        await updateListingByName(client,"Charming Flat in Downtown Moda",{bedrooms:6,beds:12})


    }catch(e){
        console.log(e);
    }finally{
        await client.close();
    }
}


main().catch(console.error);

async function createListing(client,newListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing)

    console.log(`new listing is  created with  the following  id: ${result.insertedId}`);

}


async function createMultipleListing(client,newListings){
    const result = await client.db("sample_airbnb").collection("listingAndReviews").insertMany(newListings)

    console.log(`${result.insertedCount} new listing is created  with following  id :`)
    console.log(result.insertedIds)

}

async  function findOneListing(client,nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name:nameOfListing});


    if (result){
        console.log(`found  a listing element  with nasme '${nameOfListing}'`);
        console.log(result);

    } else{
         console.log(`No listing found in the collection  with name '${nameOfListing}'`);
    }
}


async function findListingWithBathroomBedRoomAndWithreviews(client,{
    minimumnumberOfBedRooms = 0,
    minimumnumberofBathroom = 0,
    maxmimumNumberOfResult = Number.MAX_SAFE_INTEGER

} = {}){
    const curser = client.db("sample_airbnb").collection("listingAndReviews").find({
        
        bedrooms: {$gte:minimumnumberOfBedRooms},
        bathrooms :{$gte: minimumnumberofBathroom}
    }).sort({ last_review: -1}).limit(maxmimumNumberOfResult);

    const results = await  curser.toArray();

    if (results.length > 0){
        console.log(`found listing (s) with  at least  ${minimumnumberOfBedRooms} bedrooms and ${minimumnumberofBathroom} bathrooms:`);
        results.forEach((result,i)=>{
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i+1}. name :${result.name}`)
            console.log(` __id: ${result.__id}`);
            console.log(` bedRoom: ${result.bedrooms}`);
            console.log(` bathRoom: ${result.bathrooms}`);
            console.log(` most  recent  review date: ${ new Date(result.last_review).toDateString()}`);



        });
    }else{
        console.log(`no listing  found  with  at least  ${minimumnumberOfBedRooms} bedrooms and ${minimumnumberofBathroom}  bathrooms`);
    }
}


async function updateListingByName(client,nameOfListing, updatedlisting){
    const result  = await  client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name:nameOfListing},{$set:updatedlisting});


    console.log(`${result.matchedCount} documents  matched  the query   critera`);
    console.log(`${result.modifiedCount} documents  matched  the query   critera`);

}

async function listDatabases(client){
    const  databaseslist = await client.db().admin().listDatabases();

    console.log("DataBase:");
    databaseslist.databases.forEach(db =>{
        console.log(` - ${db.name}`);
    })
}