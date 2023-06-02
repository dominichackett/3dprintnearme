import React, { createContext, useState, useEffect, Children } from 'react';
import { getAutenticationCodeSXT } from '../utils/utils';
import { decodeBase64 } from 'tweetnacl-util';
import nacl from 'tweetnacl'

const TokenContext = createContext({
    accessToken: '',
    refreshToken: '',
    accessTokenExpires: 0,
    refreshTokenExpires:0,
  });

const TokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
   const [accessTokenExpires,setAccessTokenExpires] =  useState(0)
   const [refreshTokenExpires,setRefreshTokenExpires] = useState(0)
  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      // Perform the refresh token request to obtain a new access token


      const response =  await fetch('http://localhost:3000/api/refreshToken')

      console.log(response)
      if (response.ok) {
        const { accessToken: newAccessToken,refreshToken:newRefreshToken,accessTokenExpires: newAccessTokenExpires,refreshTokenExpires: newRefreshTokenExpires } = await response.json();
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken)
        setAccessTokenExpires(newAccessTokenExpires)
        setRefreshTokenExpires(newRefreshTokenExpires)
        localStorage.setItem('accessToken',newAccessToken);
        localStorage.setItem('accessTokenExpires',newAccessTokenExpires);
      } else {
        // Handle error response
        console.log(response)
      }
    } catch (error) {
      // Handle network or other errors
      console.log(error)
    }
  };

  // Function to fetch initial tokens from their respective endpoints
  const fetchTokens = async () => {
    try {

        const _accessToken = localStorage.getItem('accessToken');
        let _accessTokenExpires  =  parseInt(localStorage.getItem('accessTokenExpires'));
        _accessTokenExpires  = (isNaN(_accessTokenExpires) ? 0 : _accessTokenExpires)
        setAccessToken(_accessToken)
       const currentDate = new Date().getTime()
        
             console.log(_accessToken)
             console.log(_accessTokenExpires)
             console.log(currentDate)
         if(currentDate < _accessTokenExpires ) //Check if Access token Expired
            return

        const authCode = await getAutenticationCodeSXT()
        if(authCode.type =='CLIENT: Resource already exists')
        return
        console.log(authCode)
        const privateKeyBytes = decodeBase64(process.env.NEXT_PUBLIC_PRIVATE_KEY);
       
     
        const key =  nacl.sign.keyPair.fromSeed(privateKeyBytes)
       
       const secretKey64 = new Uint8Array(64);
       secretKey64.set(privateKeyBytes);

       const encoder = new TextEncoder("utf-8");
       const encodedData = encoder.encode(authCode.authCode);
       const uint8Array = new Uint8Array(encodedData);
       const hexAuthCode = Array.from(uint8Array, byte => byte.toString(16).padStart(2, '0')).join('');

       const signature = nacl.sign.detached(uint8Array,key.secretKey)
       const hexString = Array.from(signature, byte => byte.toString(16).padStart(2, '0')).join('');
     
        const options = {
        method: 'POST',
        headers: { accept: '*/*', 'content-type': 'application/json' },
        body: JSON.stringify({
          userId: process.env.NEXT_PUBLIC_SXT_USERID,
          authCode: authCode.authCode,
          signature: hexString,
          key:process.env.NEXT_PUBLIC_PUBLIC_KEY
        })
      };
      // Fetch the access token
      const accessTokenResponse =  await fetch('http://localhost:3000/api/getToken', options)
      if (accessTokenResponse.ok) {
        const { accessToken,refreshToken,accessTokenExpires,refreshTokenExpires } = await accessTokenResponse.json();
        setAccessToken(accessToken);
        setRefreshToken(refreshToken)
        setAccessTokenExpires(accessTokenExpires)
        setRefreshTokenExpires(refreshTokenExpires)
         localStorage.setItem('accessToken',accessToken);
         localStorage.setItem('accessTokenExpires',accessTokenExpires);
       
    } else {
        // Handle error response
        console.log(accessTokenResponse)
      }

    } catch (error) {
      // Handle network or other errors
      console.log(error)
    }
  };

  // Fetch tokens when the component mounts
  useEffect(() => {
    fetchTokens();
  }, []);

  // Use a separate effect to refresh the access token when needed
  useEffect(() => {
    // Refresh the access token before it expires
    const refreshInterval = setInterval(refreshAccessToken, 25 * 60 * 1000); // Refresh every 25 minutes

    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshToken]);

  return (
    <TokenContext.Provider value={{ accessToken, refreshToken,accessTokenExpires,refreshTokenExpires }}>
        {children}
    </TokenContext.Provider>
  );
};

export { TokenProvider, TokenContext };
