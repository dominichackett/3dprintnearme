import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import { Chain ,goerli,optimismGoerli,gnosisChiado,filecoinHyperspace,polygonMumbai} from 'wagmi/chains';

import { publicProvider } from 'wagmi/providers/public'
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitSiweNextAuthProvider ,GetSiweMessageOptions} from '@rainbow-me/rainbowkit-siwe-next-auth';
import { SessionProvider } from 'next-auth/react';
import {
  getDefaultWallets,
  RainbowKitProvider,darkTheme 
} from '@rainbow-me/rainbowkit';

import { TokenProvider } from '../components/Context/spacetime';

const zkEVM :Chain = {
    id:1442,
    name:"zkEVM Testnet",
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://explorer.public.zkevm-test.net']
      },
      public: {
        http: ['https://explorer.public.zkevm-test.net']
      },
    },
    blockExplorers: {
      default: { name: 'zkScan', url: 'https://explorer.public.zkevm-test.net' },
    },
    testnet: true,
  };

  
  

  const scrollTestnet :Chain = {
    id:534353,
    name:"Scroll Testnet",
    nativeCurrency: {
      decimals: 18,
      name: 'Ethereum',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: {
        http: ['https://alpha-rpc.scroll.io/l2']
      },
      public: {
        http: ['https://alpha-rpc.scroll.io/l2']
      },
    },
   
    testnet: true,
  };
    
  const calibration :Chain = {
    id:314159 ,
    name:"Filecoin Calibration Testnet",
    nativeCurrency: {
      decimals: 18,
      name: 'FILECOIN',
      symbol: 'TFIL',
    },
    rpcUrls: {
      default: {
        http: ['https://api.calibration.node.glif.io/rpc/v1']
      },
      public: {
        http: ['https://api.calibration.node.glif.io/rpc/v1']
      },
    },
   
    testnet: true,
  };
    
// Configure chains & providers
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider } = configureChains(
  [calibration],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: '3d Print Near Me',
  chains
});

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: 'Sign in to 3d Print Near Me',
});

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: connectors,
  provider,
  
})

export default function App({ Component, pageProps }: AppProps) {
  return   <WagmiConfig client={client}>
        <SessionProvider refetchInterval={0} session={pageProps.session}>
  
    <RainbowKitSiweNextAuthProvider
  getSiweMessageOptions={getSiweMessageOptions}
>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>

  <Component {...pageProps} /></RainbowKitProvider></RainbowKitSiweNextAuthProvider>
  </SessionProvider></WagmiConfig>
}
