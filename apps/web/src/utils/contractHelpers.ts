import { CAKE } from '@pancakeswap/tokens'

// Addresses
import {
  getBCakeFarmBoosterAddress,
  getBCakeFarmBoosterProxyFactoryAddress,
  getBCakeFarmBoosterV3Address,
  getBCakeFarmBoosterVeCakeAddress,
  getCakeFlexibleSideVaultAddress,
  getCakeVaultAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getFarmAuctionAddress,
  getFixedStakingAddress,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNonBscVaultAddress,
  getPointCenterIfoAddress,
  getRevenueSharingCakePoolAddress,
  getRevenueSharingPoolAddress,
  getRevenueSharingPoolGatewayAddress,
  getRevenueSharingVeCakeAddress,
  getStableSwapNativeHelperAddress,
  getTradingRewardAddress,
  getTradingRewardTopTradesAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
} from 'utils/addressHelpers'

// ABI
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { nonBscVaultABI } from 'config/abi/nonBscVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import { ChainId } from '@pancakeswap/chains'
import { cakeFlexibleSideVaultV2ABI, cakeVaultV2ABI } from '@pancakeswap/pools'
import {
  positionManagerAdapterABI,
  positionManagerVeBCakeWrapperABI,
  positionManagerWrapperABI,
} from '@pancakeswap/position-managers'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { fixedStakingABI } from 'config/abi/fixedStaking'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { revenueSharingPoolGatewayABI } from 'config/abi/revenueSharingPoolGateway'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'
import { bCakeFarmBoosterProxyFactoryABI } from 'config/abi/bCakeFarmBoosterProxyFactory'
import { bCakeProxyABI } from 'config/abi/bCakeProxy'

import { bCakeFarmBoosterV3ABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterV3'
import { bCakeFarmBoosterVeCakeABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterVeCake'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.BSC,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    // TODO: Fix viem
    // @ts-ignore
    publicClient: publicClient ?? viemClients[chainId],
    // TODO: Fix viem
    // @ts-ignore
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getBCakeFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bCakeFarmBoosterABI, address: getBCakeFarmBoosterAddress(), signer })
}

export const getBCakeFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bCakeFarmBoosterV3ABI, address: getBCakeFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBCakeFarmBoosterVeCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bCakeFarmBoosterVeCakeABI,
    address: getBCakeFarmBoosterVeCakeAddress(chainId),
    signer,
    chainId,
  })
}

export const getBCakeFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bCakeFarmBoosterProxyFactoryABI,
    address: getBCakeFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBCakeProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bCakeProxyABI, address: proxyContractAddress, signer })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? CAKE[chainId]?.address : CAKE[ChainId.BSC].address,
    chainId,
  })
}

export const getCakeVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: cakeVaultV2ABI, address: getCakeVaultAddress(chainId), signer, chainId })
}

export const getCakeFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: cakeFlexibleSideVaultV2ABI,
    address: getCakeFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}

export const getPositionManagerWrapperContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerBCakeWrapperContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerVeBCakeWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerAdapterContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerAdapterABI,
    address,
    signer,
    chainId,
  })
}

export const getNonBscVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonBscVaultABI, address: getNonBscVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV2ABI,
    address: getMasterChefV2Address(chainId),
    chainId,
    signer,
  })
}
export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  const mcv3Address = getMasterChefV3Address(chainId)
  return mcv3Address
    ? getContract({
        abi: masterChefV3ABI,
        address: mcv3Address,
        chainId,
        signer,
      })
    : null
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolABI,
    address: getRevenueSharingPoolAddress(chainId),
    signer,
    chainId,
  })
}

export const getFixedStakingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fixedStakingABI,
    address: getFixedStakingAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingCakePoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingCakePoolAddress(chainId) ?? getRevenueSharingCakePoolAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingVeCakeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeCakeAddress(chainId) ?? getRevenueSharingVeCakeAddress(ChainId.BSC),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolGatewayContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolGatewayABI,
    address: getRevenueSharingPoolGatewayAddress(chainId) ?? getRevenueSharingPoolGatewayAddress(ChainId.BSC),
    signer,
    chainId,
  })
}
