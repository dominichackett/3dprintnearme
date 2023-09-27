const printTimeTable = 'printnearme_printtime_314159_381';
export const createPrintTimeTable = async(db)=>
{
    const { meta: create } = await db
    .prepare(`CREATE TABLE printnearme_printtime (id text primary key, printTime text,totalFilament text,totalWeight text);`)
    .run();

    console.log(create.txn.name); // e.g., my_sdk_table_80001_311


  
}


export const insertPrintTime =async (db,id,printTime,totalFilament,totalWeight) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${printTimeTable} ( id,printTime,totalFilament,totalWeight) VALUES ( ?,?,?,?);`)
.bind(id,printTime,totalFilament,totalWeight)
.run();

// Wait for transaction finality
//await insert.txn?.wait();
}


export const queryPrintTime = async(db,id)=>{

    try {const { results } = await db.prepare(`SELECT * FROM ${printTimeTable} where id='${id}';`).all();

   return results;
} catch(error)
{
     console.log(error)
     return []
}
}
