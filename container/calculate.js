/*
 * Author:Dominic Hackett
 * Description:  Calculates the print time and filament used to print 3d objects
 *    
*/
import {config} from 'dotenv'
import { ethers } from 'ethers' 
import {PNMTADDRESS} from './contracts.js' 
import { getTokenMetadata ,getWallet,getProvider} from './utils.js';
import lighthouse from '@lighthouse-web3/sdk';
import {TextDecoder} from 'util'
import {loadFile} from './process.js'
import { createPrintTimeTable,insertPrintTime,queryPrintTime } from './tableland.js';
import { Database } from "@tableland/sdk";

config();
const wallet = getWallet();
const provider = getProvider();
const signer = wallet.connect(provider)
console.log(signer)
let db = new Database({signer})
let gcodeFiles = [];
let material;
let printTime =0
let totalFilament = 0
let totalWeight = 0
const args = process.argv.slice(2);
console.log(args);
console.log(PNMTADDRESS)
console.log(process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY)

//const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_MarketPlace_PRIVATE_KEY)
//console.log(wallet.address)

if(!args[0])
{
  console.log("Not defined")
  
}else
  if(args[0] == "create")
    createPrintTimeTable(db)
  else
    main()
 
async function main(){
   
  const result = await queryPrintTime(db,args[0])
  if (result.length > 0)
  {
    console.log(`Found ${result[0]}`)
    return
  
  }
    
  await getTokenData()
   console.log(gcodeFiles.length)
   
   if(gcodeFiles.length > 0)
   {

        const tx = new TextDecoder('utf-8')
        for(let loop=0;loop <gcodeFiles.length;loop++)
        {
          const  gcode = tx.decode(gcodeFiles[loop])
          const result =loadFile({gcode: gcode},material)
          console.log(result)
          totalFilament += result.totalFilament
          totalWeight += result.totalWeight
          printTime += result.printTime
  
        }

       
      await insertPrintTime(db,args[0], printTime.toString(),totalFilament.toString(),totalWeight.toString())      
        
   }
    
}

async function getTokenData()
  {
   
      const result = await getTokenMetadata(args[0])
      if(result)
      {
         console.log(result) 
         const folders = JSON.parse(result.folders)
          const _gcode = JSON.parse(result.gcode)  
          material = result.material
          //let _fileMap = new Map() 
          for(const folders in _gcode )
            for(const file in _gcode[folders])
          {
           // console.log(_gcode[folders][file].cid,_gcode[folders][file].name)
           const messageRequested = (await lighthouse.getAuthMessage(wallet.address)).data.message;
           console.log(messageRequested)
           const signedMessage = await wallet.signMessage(messageRequested);
           console.log(signedMessage)
            const key  = await lighthouse.fetchEncryptionKey(_gcode[folders][file].cid,wallet.address,signedMessage)
            console.log(key)
            const fileData = await lighthouse.decryptFile(_gcode[folders][file].cid,key.data.key,"text")
          //  console.log(key)
            console.log(_gcode[folders][file].cid)
            gcodeFiles.push(fileData)
          }
      }  
  }