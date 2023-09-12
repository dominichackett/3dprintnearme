export const printerTable = 'printnearme_printer_314159_267'
export const marketPlaceTable = 'printnearme_marketplace_314159_273'
export const categoryTable = 'printnearme_category_314159_265'
export const orderTable = 'printnearme_order_314159_272'



export const createCategoryTable = async(db:any)=>
{
    const { meta: create } = await db
    .prepare(`CREATE TABLE printnearme_category (id integer primary key, name text);`)
    .run();

    console.log(create.txn.name); // e.g., my_sdk_table_80001_311


  
}

export const createPrinterTable = async(db:any)=>
{
    const { meta: create } = await db

    .prepare(`CREATE TABLE printnearme_printer (id integer primary key, name text,rate text,city text,state text,zip text,country text,materials text, info text,url text);`)
    .run();

    console.log(create.txn.name); // e.g., my_sdk_table_80001_311


  
}


export const createMarketPlaceTable = async(db:any)=>
{
    const { meta: create } = await db

    .prepare(`CREATE TABLE printnearme_marketplace (id integer primary key,itemid text,price text,datelisted integer, owner text, category integer );`)
    .run();

    console.log(create.txn.name); // e.g., my_sdk_table_80001_311


  
}


export const createOrderTable = async(db:any)=>
{
 
    const { meta: create } = await db

    .prepare(`CREATE TABLE printnearme_order (id integer primary key,dateplaced integer,printer integer, status integer,tokenid text,item text,filamentcost text, hourlycost text, notes text);`)
    .run();

    console.log(create.txn.name); // e.g., my_sdk_table_80001_311


  
}

export const insertCategory =async (db:any,name:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${categoryTable} ( name) VALUES ( ?);`)
.bind(name)
.run();

// Wait for transaction finality
await insert.txn.wait();
}

export const insertPrinter =async (db:any,name:string,rate:string,city:string,state:string,country:string,zip:string,materials:string,info:string,url:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${printerTable} ( name,rate,city,state,country,zip,materials,info,url) VALUES ( ?,?,?,?,?,?,?,?,?);`)
.bind(name,rate,city,state,country,zip,materials,info,url)
.run();

// Wait for transaction finality
await insert.txn.wait();
}

export const insertMarketPlace = async(db:any,itemid:number,price:string,datelisted:string,owner:string,category:number)=>{
    const { meta: insert } = await db
    .prepare(`INSERT INTO ${marketPlaceTable} ( itemid,price,datelisted,owner,category) VALUES ( ?,?,?,?,?);`)
    .bind(itemid,price,datelisted,owner,category)
    .run();
    
    // Wait for transaction finality
    await insert.txn.wait();
}

export const insertOrder = async (db:any,dateplaced:string,printer:number,datelisted:string,tokenid:number,item:number,filamentcost:string,hourlycost:string,notes:string)=>{
    const { meta: insert } = await db
    .prepare(`INSERT INTO ${orderTable} ( dateplaced,printer,datelisted,tokenid,item,filamentcost,hourlycost,notes,status) VALUES ( ?,?,?,?,?,?,?,?,?);`)
    .bind(dateplaced,printer,datelisted,tokenid,item,filamentcost,hourlycost,notes,0)
    .run();
    
    // Wait for transaction finality
    await insert.txn.wait();
}

export const updatePrinter = async (db:any,id:number,name:string,rate:string,city:string,state:string,country:string,zip:string,materials:string,info:string,url:string) => {    
    // Insert a row into the table
    const { meta: update } = await db
    .prepare(`UPDATE  ${printerTable} set name=?,rate=?,city=?,state=?,country=?,zip=?,materials=?,info=?,url=? where id=?;`)
    .bind(name,rate,city,state,country,zip,materials,info,url,id)
    .run();
    
    // Wait for transaction finality
    await update.txn.wait();
    
}

export const updateOrderStatus = async (db:any,id:number,status:number)=>{
    const { meta: update } = await db
    .prepare(`UPDATE ${orderTable} set status=? where id=?;`)
    .bind(status,id)
    .run();
    
    // Wait for transaction finality
    await update.txn.wait();
}

export const updateOrder = async (db:any,id:number,item:number)=>{
    const { meta: update } = await db
    .prepare(`UPDATE ${orderTable} set item=? where id=?;`)
    .bind(item,id)
    .run();
    
    // Wait for transaction finality
    await update.txn.wait();
}

export const queryCategory = async(db:any)=>{

    const { results } = await db.prepare(`SELECT * FROM ${categoryTable} order by name;`).all();

   return results;

}

export const queryMarketPlace = async(db:any)=>{

    const { results } = await db.prepare(`SELECT * FROM ${marketPlaceTable} order by dateplaced;`).all();

   return results;

}

export const queryMarketPlaceByOwner = async(db:any,owner:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${marketPlaceTable} where owner=${owner} order by dateplaced desc;`).all();

   return results;

}

export const queryOrderForPrinter = async(db:any,printer:string,)=>{

    const { results } = await db.prepare(`SELECT * FROM ${orderTable} where printer=${printer} order by dateplaced desc;`).all();

   return results;

}


export const queryOrderByOwner = async(db:any,owner:string,)=>{

    const { results } = await db.prepare(`SELECT * FROM ${orderTable} where owner=${owner} order by dateplaced desc;`).all();

   return results;

}
