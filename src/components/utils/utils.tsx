import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
export const getAutenticationCodeSXT = async ()=> {
    const options = {
        method: 'POST',
        headers: {accept: '*/*', 'content-type': 'application/json'},
        body: JSON.stringify({userId: process.env.NEXT_PUBLIC_SXT_USERID})
      };
    fetch(process.env.NEXT_PUBLIC_SXT_URL+"v1/auth/code", options)
    .then(response => response.json())
    .then(response => console.log(response))
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

export const firstQuery = async ()=> {
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: 'Bearer eyJ0eXBlIjoiYWNjZXNzIiwia2lkIjoiNGE2NTUwNjYtZTMyMS00NWFjLThiZWMtZDViYzg4ZWUzYTIzIiwiYWxnIjoiRVMyNTYifQ.eyJpYXQiOjE2ODQ0Mzc2NTIsIm5iZiI6MTY4NDQzNzY1MiwiZXhwIjoxNjg0NDM5MTUyLCJ0eXBlIjoiYWNjZXNzIiwidXNlciI6IjNkcHJpbnQiLCJzdWJzY3JpcHRpb24iOiI0MzM1NmMxZS0xMDUxLTQzZTEtYmNlZS02NjNlMjY2N2NjZjEiLCJzZXNzaW9uIjoiMWRhOGE4YWNmYzVkM2JkOGFjMmY2ZTFhIiwic3NuX2V4cCI6MTY4NDUyNDA1MjYzNCwiaXRlcmF0aW9uIjoiNTJkNWNmOTk1MDMxNjNmOTc2NzkzYzMwIn0.FHqBRRk8ct99K2MwcvKOQ9cbZ-UfrsBVaWd5dPI2emmBx-kTRVagr63o73QRbzl2vZTqp19crUMhUpWgp2AgDQ'
        },
        body: JSON.stringify({
          sqlText: 'SELECT COUNT(*) FROM ETHEREUM.ERC721_TRANSFER WHERE CONTRACT_ADDRESS = \'0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\' --BAYC   AND CAST(TIME_STAMP AS DATE) = \'2023-03-09\'',
          resourceId: 'ETHEREUM.ERC721_TRANSFER'
        })
      };
      
      fetch(process.env.NEXT_PUBLIC_SXT_URL+'v1/sql/dql', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

export const authenticateSXT = async (authCode:string)=>{
   
    const dataUint8 = util.decodeUTF8(authCode);

    const signature = nacl.sign.detached(dataUint8, process.env.NEXT_PUBLIC_PRIVATE_KEY);

    const options = {
        method: 'POST',
        headers: {accept: '*/*', 'content-type': 'application/json'},
        body: JSON.stringify({userId: process.env.NEXT_PUBLIC_SXT_USERID, authCode: authCode, signature: signature, key: process.env.NEXT_PUBLIC_PUBLIC_KEY})
      };
      
      fetch(process.env.NEXT_PUBLIC_SXT_URL+'v1/auth/token', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}