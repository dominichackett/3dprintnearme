import {PNMTADDRESS,PNMTABI} from './contracts.js' 
import {ethers} from 'ethers'
import {config} from 'dotenv'
import axios from "axios";

config()

export  function formatIPFSURL(url){
    if(url.includes(".ipfs.w3s.link/"))
      return url
  
    const formattedURL = url
        .replace('ipfs://', 'https://')
        .replace(/\/[^/]+$/, (match) => match.replace('/', '.ipfs.w3s.link/'));
    
      return formattedURL;
    }

export async function getTokenMetadata(
    tokenId
   ) {
     const contract = new ethers.Contract(PNMTADDRESS, PNMTABI,getProvider());
  
     try {
       const tokenURI = await contract.tokenURI(tokenId);
        if(!tokenURI)
          return null

        const metadataurl =formatIPFSURL(tokenURI)

        // Use Axios to fetch the token metadata
        const response = await axios.get(metadataurl);
        const tokenMetadata = await response.data; // Assuming the response contains JSON metadata
       return tokenMetadata  
     }catch(error)
     {
          return null
     }  
 
   }

   export function getProvider(){
    const provider = new ethers.providers.JsonRpcProvider("https://api.calibration.node.glif.io/rpc/v1");
     return provider
   }

   export function getWallet()
   {
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_MarketPlace_PRIVATE_KEY)
     return wallet
   }
 