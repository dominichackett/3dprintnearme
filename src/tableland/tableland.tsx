export const printerTable = 'printnearme_printer_314159_290'
export const marketPlaceTable = 'printnearme_marketplace_314159_275'
export const categoryTable = 'printnearme_category_314159_265'
export const orderTable = 'printnearme_order_314159_312'


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

    .prepare(`CREATE TABLE printnearme_printer (id text primary key, name text,rate text,city text,state text,zip text,country text,materials text, info text,url text);`)
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

    .prepare(`CREATE TABLE printnearme_order (id integer primary key,dateplaced integer,owner text,printer text, status integer,tokenid text,item text,filamentcost text, hourlycost text, notes text);`)
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
await insert.txn?.wait();
}


export const updateCategory =async (db:any,id:number,name:string) => {
    // Insert a row into the table
const { meta: update } = await db
.prepare(`UPDATE ${categoryTable} set name =? where id=?;`)
.bind(name,id)
.run();

// Wait for transaction finality
await update.txn?.wait();
}

export const insertPrinter =async (db:any,id:string,name:string,rate:string,city:string,state:string,country:string,zip:string,materials:string,info:string,url:string) => {
    // Insert a row into the table
const { meta: insert } = await db
.prepare(`INSERT INTO ${printerTable} (id, name,rate,city,state,country,zip,materials,info,url) VALUES ( ?,?,?,?,?,?,?,?,?,?);`)
.bind(id,name,rate,city,state,country,zip,materials,info,url)
.run();

// Wait for transaction finality
await insert.txn?.wait();
}

export const insertMarketPlace = async(db:any,itemid:string,price:string,datelisted:number,owner:string,category:number)=>{
    const { meta: insert } = await db
    .prepare(`INSERT INTO ${marketPlaceTable} ( itemid,price,datelisted,owner,category) VALUES ( ?,?,?,?,?);`)
    .bind(itemid,price,datelisted,owner,category)
    .run();

    // Wait for transaction finality
    await insert.txn?.wait();
}

export const insertOrder = async (db:any,dateplaced:number,owner:string,printer:string,tokenid:string,item:string,filamentcost:string,hourlycost:string,notes:string)=>{
    const { meta: insert } = await db
    .prepare(`INSERT INTO ${orderTable} ( dateplaced,owner,printer,status,tokenid,item,filamentcost,hourlycost,notes,status) VALUES ( ?,?,?,?,?,?,?,?,?,?);`)
    .bind(dateplaced,owner,printer,1,tokenid,item,filamentcost,hourlycost,notes,0)
    .run();
    
    // Wait for transaction finality
    await insert.txn?.wait();
}

export const updatePrinter = async (db:any,id:string,name:string,rate:string,city:string,state:string,country:string,zip:string,materials:string,info:string,url:string) => {    
    // Insert a row into the table
    const {meta:update} = await db
    .prepare(`UPDATE  ${printerTable} set name=?,rate=?,city=?,state=?,country=?,zip=?,materials=?,info=?,url=? where id=?;`)
    .bind(name,rate,city,state,country,zip,materials,info,url,id)
    .run();
    
    //console.log(x)
    // Wait for transaction finality
    //await update.txn?.wait();
    
}

export const updateOrderStatus = async (db:any,id:number,status:number)=>{
    const { meta: update } = await db
    .prepare(`UPDATE ${orderTable} set status=? where id=?;`)
    .bind(status,id)
    .run();
    
    // Wait for transaction finality
    await update.txn?.wait();
}

export const updateOrder = async (db:any,id:number,item:number)=>{
    const { meta: update } = await db
    .prepare(`UPDATE ${orderTable} set item=? where id=?;`)
    .bind(item,id)
    .run();
    
    // Wait for transaction finality
    await update.txn?.wait();
}

export const queryCategory = async(db:any)=>{

    const { results } = await db.prepare(`SELECT * FROM ${categoryTable} order by name;`).all();

   return results;

}

export const queryMarketPlace = async(db:any)=>{

    const { results } = await db.prepare(`SELECT * FROM ${marketPlaceTable} order by datelisted desc;`).all();

   return results;

}

export const queryMarketPlaceByOwner = async(db:any,owner:string)=>{

    const { results } = await db.prepare(`SELECT * FROM ${marketPlaceTable} where owner='${owner}' order by datelisted desc;`).all();

   return results;

}

export const queryOrderForPrinter = async(db:any,printer:string,)=>{

    const { results } = await db.prepare(`SELECT * FROM ${orderTable} where printer='${printer}' order by dateplaced desc;`).all();

   return results;

}


export const queryOrderByOwner = async(db:any,owner:string,)=>{

    const { results } = await db.prepare(`SELECT * FROM ${orderTable} where owner='${owner}' order by dateplaced desc;`).all();

   return results;

}



export const queryPrinter = async (db: any,id:string,name:string,city:string,state:string,zip:string,country:string) => {
    
    let whereClause = ""
   whereClause += (name != null ? `name='${name}'`:"")
    whereClause += (city != null ? (whereClause !=""? ` and city='${city}'`:`city='${city}'`):"")
    whereClause += (state != null ? (whereClause !=""? ` and state='${state}'`:`state='${state}'`):"")
    whereClause += (zip != null ? (whereClause !=""? ` and zip='${zip}'`:`zip='${zip}'`):"")
    whereClause += (country != null ? (whereClause !=""? ` and country='${country}'`:`country='${country}'`):"")
    whereClause += (id != null ? (whereClause !=""? ` and id='${id}'`:`id='${id}'`):"")

    whereClause = (whereClause != "" ?`where ${whereClause}`:"")

    const { results } = await db.prepare(`SELECT * FROM ${printerTable}  ${whereClause} ;`).all();

   return results;


    };

