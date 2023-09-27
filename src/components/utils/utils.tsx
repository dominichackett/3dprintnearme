import { decodeBase64 } from 'tweetnacl-util';
import nacl from 'tweetnacl'
import axios from "axios";
import { ethers } from "ethers";

import { PNMTADDRESS ,PNMTABI} from '../Contracts/contracts';
export const getAutenticationCodeSXT = async ()=> {
    
  return  fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/getAuthCode`)
    .then(response => response.json())
    .then(response => {return response})
    .catch(err => console.error(err));
}


export const Logout = async() =>{
    const options = {method: 'POST', headers: {accept: '*/*'}};

fetch(process.env.NEXT_PUBLIC_SXT_URL+'v1/auth/logout', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));
}


export const tokenRequest = async (authCode:string,signature:string,key:string) => {
    const options = {
        method: 'POST',
        headers: {accept: '*/*', 'content-type': 'application/json'},
        body: JSON.stringify({userId: process.env.NEXT_PUBLIC_SXT_USERID, authCode: authCode, signature: signature, key: key})
      };
      
      fetch(process.env.NEXT_PUBLIC_SXT_URL+'v1/auth/token', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

export const firstQuery = async (authToken: string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        sqlText:
          "SELECT COUNT(*) FROM ETHEREUM.ERC721_TRANSFER WHERE CONTRACT_ADDRESS = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D' --BAYC   AND CAST(TIME_STAMP AS DATE) = '2023-03-09'",
        resourceId: 'ETHEREUM.ERC721_TRANSFER',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  





export const authenticateSXT = async (authCode: string) => {
    const privateKeyBytes = decodeBase64(process.env.NEXT_PUBLIC_PRIVATE_KEY);
   // console.log(privateKeyBytes)
   // console.log(privateKeyBytes.length)  
  //  const _key = new TextEncoder().encode(privateKeyBytes);

   const key =  nacl.sign.keyPair.fromSeed(privateKeyBytes)
  //console.log(key)
  const secretKey64 = new Uint8Array(64);
  secretKey64.set(privateKeyBytes);
  
  const encoder = new TextEncoder("utf-8");
const encodedData = encoder.encode(authCode);
const uint8Array = new Uint8Array(encodedData);
const hexAuthCode = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');
console.log(hexAuthCode)
console.log(encodedData)
console.log(uint8Array)
console.log(authCode)
  const signature = nacl.sign.detached(uint8Array,key.secretKey)
  const decoder = new TextDecoder();
  const decodedString = decoder.decode(signature);
  console.log(decodedString)
  //const decodedKey = decoder.decode(key.publicKey)
  //console.log(decodedKey)
  
  const hexString = Array.from(signature, byte => byte.toString(16).padStart(2, '0')).join('');
 console.log(hexString)
 console.log(signature.toString())
 console.log(process.env.NEXT_PUBLIC_PUBLIC_KEY)
 const publicKey = nacl.sign.keyPair.fromSecretKey(secretKey64).publicKey;
 console.log(publicKey)
 const isVerified = nacl.sign.detached.verify(uint8Array, signature, key.publicKey);
alert(isVerified)

  const options = {
    method: 'POST',
    headers: { accept: '*/*', 'content-type': 'application/json' },
    body: JSON.stringify({
      userId: process.env.NEXT_PUBLIC_SXT_USERID,
      authCode: authCode,
      signature: hexString,
      key:process.env.NEXT_PUBLIC_PUBLIC_KEY
    })
  };

  fetch(process.env.NEXT_PUBLIC_SXT_URL + 'v1/auth/token', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

};
  

export const insertCategory = async (authToken: string,id:string,name:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `INSERT into PRINTNEARME.CATEGORY (ID,NAME) VALUES('${id}','${name}')`,
        resourceId: 'PRINTNEARME.CATEGORY',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}api/insertCategory`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  


  export const queryCategory = async (authToken: string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_CATEGORY}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          "SELECT * FROM PRINTNEARME.CATEGORY ORDER BY NAME",
        resourceId: 'PRINTNEARME.CATEGORY',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const deleteCategory = async (authToken: string,id:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
       
      
        id:id,
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/deleteCategory`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  export const insertMarketPlace = async (authToken: string,id:string,itemid:number,price:number,datelisted:string,owner:string,category:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `INSERT into PRINTNEARME.MARKETPLACE (ID,ITEMID,PRICE,DATELISTED,OWNER,CATEGORY) VALUES('${id}',${itemid}
          ,${price},'${datelisted}','${owner}','${category}')`,
        resourceId: 'PRINTNEARME.MARKETPLACE',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertMarketPlace`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };



  export const queryMarketPlace = async (authToken: string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_CATEGORY}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          "SELECT * FROM PRINTNEARME.MARKETPLACE ORDER BY DATELISTED DESC",
        resourceId: 'PRINTNEARME.MARKETPLACE',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const queryMarketPlaceByOwner = async (authToken: string,owner:string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_CATEGORY}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          `SELECT * FROM PRINTNEARME.MARKETPLACE Where owner='${owner}' ORDER BY DATELISTED DESC`,
        resourceId: 'PRINTNEARME.MARKETPLACE',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const insertOrder = async (authToken: string,id:string,dateplaced:string,owner:string,printer:string,status:number,tokenid:number,item:string,filamentcost:number, hourlycost:number,notes:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `INSERT into PRINTNEARME.ORDERS (ID,DATEPLACED,OWNER,PRINTER,STATUS,TOKENID,ITEM,FILAMENTCOST,HOURLYCOST,NOTES) 
          VALUES('${id}','${dateplaced}','${owner}','${printer}',${status},${tokenid},'${item}',${filamentcost},${hourlycost},'${notes}')`,
        resourceId: 'PRINTNEARME.ORDERS',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertOrder`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const queryOrderForPrinter = async (authToken: string,printer:string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_ORDER}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          `SELECT * FROM PRINTNEARME.ORDERS where PRINTER='${printer}'  ORDER BY DATEPLACED DESC`,
        resourceId: 'PRINTNEARME.ORDERS',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const queryOrderByOwner = async (authToken: string,owner:string) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_ORDER}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          `SELECT * FROM PRINTNEARME.ORDERS  where OWNER='${owner}' ORDER BY DATEPLACED DESC`,
        resourceId: 'PRINTNEARME.ORDERS',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const insertPrinter = async (authToken: string,id:string,owner:string,name:string,rate:number,city:string,state:string,zip:string,country:string,materials:string,info:string,url:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `INSERT into PRINTNEARME.PRINTERS (ID,OWNER,NAME,RATE,CITY,STATE,ZIP,COUNTRY,MATERIALS,INFO,URL) 
          VALUES('${id}','${owner}','${name}',${rate},'${city}','${state}','${zip}','${country}','${materials}','${info}','${url}')`,
        resourceId: 'PRINTNEARME.PRINTERS',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertPrinter`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const updatePrinter = async (authToken: string,id:string,owner:string,name:string,rate:number,city:string,state:string,zip:string,country:string,materials:string,info:string,url:string) => {
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `UPDATE PRINTNEARME.PRINTERS  
        set OWNER='${owner}',NAME='${name}',RATE=${rate},CITY='${city}',STATE='${state}',ZIP='${zip}',COUNTRY='${country}',MATERIALS='${materials}',INFO='${info}' ,URL='${url}' Where ID='${id}' `,
        resourceId: 'PRINTNEARME.PRINTERS',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertPrinter`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response.body)
        throw new Error(response.json());
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };



  export const queryPrinter = async (authToken: string,owner:string,name:string,city:string,state:string,zip:string,country:string) => {
    
    let whereClause = ""
   whereClause += (name != null ? `name='${name}'`:"")
    whereClause += (city != null ? (whereClause !=""? ` and city='${city}'`:`city='${city}'`):"")
    whereClause += (state != null ? (whereClause !=""? ` and state='${state}'`:`state='${state}'`):"")
    whereClause += (zip != null ? (whereClause !=""? ` and zip='${zip}'`:`zip='${zip}'`):"")
    whereClause += (country != null ? (whereClause !=""? ` and country='${country}'`:`country='${country}'`):"")
    whereClause += (owner != null ? (whereClause !=""? ` and owner='${owner}'`:`owner='${owner}'`):"")

    whereClause = (whereClause != "" ?`where ${whereClause}`:"")

   console.log(whereClause)
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
        biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_PRINTER}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          `SELECT * FROM PRINTNEARME.PRINTERS ${whereClause} ORDER BY NAME `,
        resourceId: 'PRINTNEARME.PRINTERS',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const queryMyObjects = async (authToken: string,owner:string) => {
    
    
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${authToken}`,
      //  biscuit: `${process.env.NEXT_PUBLIC_BISCUIT_PRINTER}`,
      originApp: '3D Print Near Me',
   
      },
      body: JSON.stringify({
        sqlText:
          `SELECT * FROM MUMBAI.ERC721_TRANSFER Where CONTRACT_ADDRESS='${PNMTADDRESS}'`,
        resourceId: 'MUMBAI.ERC721_TRANSFER',
      }),
    };
  
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SXT_URL + 'v1/sql/dql',
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const updateOrder = async (authToken: string,id:string,item:string) => {
  
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `update PRINTNEARME.ORDERS set item='${item}' where ID='${id}'`,
        resourceId: 'PRINTNEARME.ORDERS',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertOrder`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  export const updateOrderStatus= async (authToken: string,id:string,status:number) => {
  
    const options = {
     method:'Post',
      body: JSON.stringify({
        sqlText:
          `update PRINTNEARME.ORDERS set STATUS=${status} where ID='${id}'`,
        resourceId: 'PRINTNEARME.ORDERS',
      
     
        authorization: `Bearer ${authToken}`,
             }),
    };
   console.log(options)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/insertOrder`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        return data;
      } else {
        console.log(response)
        throw new Error('Request failed');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  

  export  function formatNFTSTORAGEURL(url: string): string {
    if(url.includes(".ipfs.w3s.link/"))
      return url
  
    const formattedURL = url
        .replace('ipfs://', 'https://nftstorage.link/ipfs/')    
      return formattedURL;
    }

  export  function formatIPFSURL(url: string): string {
    if(url.includes(".ipfs.w3s.link/"))
      return url
  
    const formattedURL = url
        .replace('ipfs://', 'https://')
        .replace(/\/[^/]+$/, (match: string) => match.replace('/', '.ipfs.w3s.link/'));
    
      return formattedURL;
    }

  export async function getMintedTokenURIs(
    contractAddress: string,
    contractABI: any[], // Use correct ABI type
    userAddress: string,
    provider: ethers.providers.Web3Provider
  ): Promise<Map<number, string>> {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
    const mintedTokenURIs = new Map();
    let tokenId =1
        console.log(tokenId)
    console.log(provider)
   

    while (true) {
      try {
        const tokenURI = await contract.tokenURI(tokenId);
        // Here you might want to validate the tokenURI to ensure it's not an error message
        if (tokenURI !== 'Family' && tokenURI!= 'uri' && tokenURI != undefined) {
          const owner = await contract.ownerOf( tokenId);
          if (owner == userAddress) {
           console.log(`Token uri ${tokenURI}`)
            const metadataurl =formatNFTSTORAGEURL(tokenURI)
            console.log(metadataurl)
             // Use Axios to fetch the token metadata
          const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST_URL}/api/getMetadata?url=${metadataurl}`);
          
          const tokenMetadata = response.data; // Assuming the response contains JSON metadata
         console.log(response)
          if(tokenMetadata)
            mintedTokenURIs.set(tokenId, {tokenURI,tokenMetadata});
          }
        }
  
        // Exit the loop if tokenURI is 'Family'
        if (tokenURI === 'Family' || tokenURI == 'uri') {
          break;
        }
  
        tokenId++;
      } catch (error) {
        // Handle errors, such as tokens that don't exist
        console.log(error)
        break; // Exit the loop if an error occurs
      }
    }
  
    return mintedTokenURIs;
  }



  export async function getTokenMetadata(
   tokenId:number, 
    userAddress: string,
    provider: ethers.providers.Web3Provider
  ): Promise<string> {
    const contract = new ethers.Contract(PNMTADDRESS, PNMTABI, provider);
 
    try {
      const tokenURI = await contract.tokenURI(tokenId);
      return tokenURI  
    }catch(error)
    {
         return null
    }  

  }

  export async function getMintedERC1155TokenURIs(
    contractAddress: string,
    contractABI: any[], // Use correct ABI type
    userAddress: string,
    provider: ethers.providers.Web3Provider
  ): Promise<Map<number, string>> {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
  
    const mintedTokenURIs = new Map();
    let tokenId = 1;
    console.log(tokenId)
    console.log(provider)
  
    while (true) {
      try {
        const tokenURI = await getTokenMetadata(tokenId,userAddress,provider);
        // Here you might want to validate the tokenURI to ensure it's not an error message
        if (tokenURI !== null ) {
          const balance = await contract.balanceOf(userAddress, tokenId);
          console.log(balance)
          if (balance.gt(0)) {

            const metadataurl =formatIPFSURL(tokenURI)
            console.log(metadataurl)
             // Use Axios to fetch the token metadata
          const response = await axios.get(metadataurl);
          const tokenMetadata = response.data; // Assuming the response contains JSON metadata

            mintedTokenURIs.set(tokenId, {tokenURI,tokenMetadata});
          }
        }
  
        // Exit the loop if tokenURI is 'Family'
        if (tokenURI === null) {
          break;
        }
  
        tokenId++;
      } catch (error) {
        // Handle errors, such as tokens that don't exist
        console.log(error)
        break; // Exit the loop if an error occurs
      }
    }
  
    return mintedTokenURIs;
  }

export async function getFileFromStaturn(url:string) {
  const response = await axios.get(url);
  return response.data

}


export async function register_job() {
  const formData = new FormData();
  const cid = "0x4855a24f437e3e9e50c9d74610607bbefab15fe2e622792d12e3414464e90c14"
  const requestReceivedTime = new Date()
  const endDate = requestReceivedTime.setMonth(requestReceivedTime.getMonth() + 1)
  const replicationTarget = 2
  const epochs = 4 // how many epochs before deal end should deal be renewed
  formData.append('cid', cid)
  formData.append('endDate', endDate)
  formData.append('replicationTarget', replicationTarget)
  formData.append('epochs', epochs)

  const response = await axios.post(
      'https://calibration.lighthouse.storage/api/register_job',
      formData
  )
  console.log(response.data)
}
