import { getPoolContractBySousId } from '@pancakeswap/pools'

import { Abi, Address } from 'viem'
import { erc20ABI, usePublicClient, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import addresses from 'config/constants/contracts'
import { useMemo } from 'react'
import { getMulticallAddress, getZapAddress } from 'utils/addressHelpers'
import {
  getBCakeFarmBoosterContract,
  getBCakeFarmBoosterProxyFactoryContract,
  getBCakeFarmBoosterV3Contract,
  getBCakeFarmBoosterVeCakeContract,
  getBCakeProxyContract,
  getCakeFlexibleSideVaultV2Contract,
  getCakeVaultV2Contract,
  getChainlinkOracleContract,
  getContract,
  getCrossFarmingProxyContract,
  getFixedStakingContract,
  getMasterChefContract,
  getMasterChefV3Contract,
  getNonBscVaultContract,
  getPointCenterIfoContract,
  getPositionManagerAdapterContract,
  getPositionManagerBCakeWrapperContract,
  getPositionManagerWrapperContract,
  getRevenueSharingCakePoolContract,
  getRevenueSharingPoolContract,
  getRevenueSharingPoolGatewayContract,
  getRevenueSharingVeCakeContract,
  getSidContract,
  getStableSwapNativeHelperContract,
  getTradingRewardContract,
  getTradingRewardTopTradesContract,
  getUnsContract,
  getV3AirdropContract,
  getV3MigratorContract,
} from 'utils/contractHelpers'

import { ChainId } from '@pancakeswap/chains'
import { WNATIVE, pancakePairV2ABI } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { nonfungiblePositionManagerABI } from '@pancakeswap/v3-sdk'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { zapABI } from 'config/abi/zap'
import { VaultKey } from 'state/types'

import { erc721CollectionABI } from 'config/abi/erc721collection'
import { infoStableSwapABI } from 'config/abi/infoStableSwap'
import { wethABI } from 'config/abi/weth'
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address?: Address, options?: UseContractOptions) => {
  return useContract(address, erc20ABI, options)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract((chainId && CAKE[chainId]?.address) ?? CAKE[ChainId.BSC].address, erc20ABI)
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSousChef = (id) => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  return useMemo(
    () =>
      getPoolContractBySousId({
        sousId: id,
        signer,
        chainId,
        publicClient,
      }),
    [id, signer, chainId, publicClient],
  )
}

export const usePointCenterIfoContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getPointCenterIfoContract(signer ?? undefined), [signer])
}

export const useVaultPoolContract = <T extends VaultKey>(
  vaultKey?: T,
):
  | (T extends VaultKey.CakeVault
      ? ReturnType<typeof getCakeVaultV2Contract>
      : ReturnType<typeof getCakeFlexibleSideVaultV2Contract>)
  | null => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => {
    if (vaultKey === VaultKey.CakeVault) {
      return getCakeVaultV2Contract(signer ?? undefined, chainId)
    }
    if (vaultKey === VaultKey.CakeFlexibleSideVault) {
      return getCakeFlexibleSideVaultV2Contract(signer ?? undefined, chainId)
    }
    return null
  }, [signer, vaultKey, chainId]) as any
}

export const useCakeVaultContract = () => {
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  return useMemo(() => getCakeVaultV2Contract(signer ?? undefined, chainId), [signer, chainId])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer ?? undefined), [signer, address])
}

export const useErc721CollectionContract = (collectionAddress: Address | undefined) => {
  return useContract(collectionAddress, erc721CollectionABI)
}

// Code below migrated from Exchange useContract.ts

type UseContractOptions = {
  chainId?: ChainId
}

// returns null on errors
export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address, options?: UseContractOptions) {
  return useContract(pairAddress, pancakePairV2ABI, options)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export function useBCakeFarmBoosterContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterContract(signer ?? undefined), [signer])
}

export function useBCakeFarmBoosterV3Contract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterV3Contract(signer ?? undefined, chainId), [signer, chainId])
}

export function useBCakeFarmBoosterVeCakeContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterVeCakeContract(signer ?? undefined, chainId), [signer, chainId])
}

export function usePositionManagerWrapperContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerWrapperContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function usePositionManagerBCakeWrapperContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerBCakeWrapperContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function usePositionManagerAdepterContract(address: Address) {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getPositionManagerAdapterContract(address, signer ?? undefined, chainId),
    [signer, chainId, address],
  )
}

export function useBCakeFarmBoosterProxyFactoryContract() {
  const { data: signer } = useWalletClient()
  return useMemo(() => getBCakeFarmBoosterProxyFactoryContract(signer ?? undefined), [signer])
}

export function useBCakeProxyContract(proxyContractAddress: Address) {
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getBCakeProxyContract(proxyContractAddress, signer ?? undefined),
    [signer, proxyContractAddress],
  )
}

export const useNonBscVault = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getNonBscVaultContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useSIDContract = (address, chainId) => {
  return useMemo(() => getSidContract(address, chainId), [address, chainId])
}

export const useUNSContract = (address, chainId, provider) => {
  return useMemo(() => getUnsContract(address, chainId, provider), [chainId, address, provider])
}

export const useCrossFarmingProxy = (proxyContractAddress?: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => proxyContractAddress && getCrossFarmingProxyContract(proxyContractAddress, signer ?? undefined, chainId),
    [proxyContractAddress, signer, chainId],
  )
}

export const useStableSwapNativeHelperContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getStableSwapNativeHelperContract(signer ?? undefined, chainId), [signer, chainId])
}

export function useV3NFTPositionManagerContract() {
  return useContract(addresses.nftPositionManager, nonfungiblePositionManagerABI)
}

export function useMasterchefV3() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterChefV3Contract(signer ?? undefined, chainId), [signer, chainId])
}

export function useV3MigratorContract() {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3MigratorContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useTradingRewardContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getTradingRewardContract(signer ?? undefined, chainId_ ?? chainId), [signer, chainId_, chainId])
}

export const useV3AirdropContract = () => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getV3AirdropContract(signer ?? undefined), [signer])
}

export const useInfoStableSwapContract = (infoAddress?: Address) => {
  return useContract(infoAddress, infoStableSwapABI)
}

export const useTradingRewardTopTraderContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getTradingRewardTopTradesContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useRevenueSharingPoolContract = ({ chainId: chainId_ }: { chainId?: ChainId } = {}) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(
    () => getRevenueSharingPoolContract(signer ?? undefined, chainId_ ?? chainId),
    [signer, chainId_, chainId],
  )
}

export const useFixedStakingContract = () => {
  const { chainId } = useActiveChainId()

  const { data: signer } = useWalletClient()

  return useMemo(() => getFixedStakingContract(signer ?? undefined, chainId), [chainId, signer])
}

export const useRevenueSharingCakePoolContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingCakePoolContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingVeCakeContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingVeCakeContract(signer ?? undefined, chainId), [signer, chainId])
}

export const useRevenueSharingPoolGatewayContract = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()

  return useMemo(() => getRevenueSharingPoolGatewayContract(signer ?? undefined, chainId), [signer, chainId])
}
