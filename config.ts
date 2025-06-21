import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
const projectId = 'efed0c26de74ee8b23f7e685e49b7ff2'

export const config = getDefaultConfig({
  appName: 'smart-nft',
  projectId: projectId,
  chains: [mainnet, base,sepolia],
  ssr: true,
});
