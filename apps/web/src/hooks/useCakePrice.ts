// import { chainlinkOracleCAKE } from '@pancakeswap/prediction'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { FAST_INTERVAL } from 'config/constants'

// for migration to bignumber.js to avoid breaking changes
export const useCakePrice = ({ enabled = true } = {}) => {
  const { data } = useQuery<BigNumber, Error>({
    queryKey: ['cakePrice'],
    // queryFn: async () => new BigNumber(await getCakePriceFromOracle()),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled,
  })
  return data ?? BIG_ZERO
}

// export const getCakePriceFromOracle = async () => {
//   const data = await publicClient({ chainId: ChainId.BSC }).readContract({
//     abi: chainlinkOracleABI,
//     address: chainlinkOracleCAKE[ChainId.BSC],
//     functionName: 'latestAnswer',
//   })

//   return formatUnits(data, 8)
// }
