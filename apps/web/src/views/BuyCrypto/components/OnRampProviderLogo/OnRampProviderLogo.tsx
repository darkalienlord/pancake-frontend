/* eslint-disable import/no-absolute-path */
/* eslint-disable global-require */
import { Token } from '@pancakeswap/swap-sdk-core'
import { Box, Skeleton, TokenImageWithBadge } from '@pancakeswap/uikit'
import { FiatLogo } from 'components/Logo/CurrencyLogo'
import { getImageUrlFromToken } from 'components/TokenImage'
import Image from 'next/image'
import { HtmlHTMLAttributes } from 'react'
import { ONRAMP_PROVIDERS, isNativeBtc } from 'views/BuyCrypto/constants'

const PROVIDER_ICONS = {
  [ONRAMP_PROVIDERS.MoonPay]: require('/public/images/on-ramp-providers/moonpay.svg'),
  [ONRAMP_PROVIDERS.Mercuryo]: require('/public/images/on-ramp-providers/mercuryo.svg'),
  [ONRAMP_PROVIDERS.Transak]: require('/public/images/on-ramp-providers/transak.svg'),
} satisfies Record<keyof typeof ONRAMP_PROVIDERS, any>

const OnRampProviderLogo = ({
  provider,
  size = 35,
  loading = false,
}: {
  provider: keyof typeof ONRAMP_PROVIDERS | undefined
  size?: number
  loading?: boolean
  styles?: HtmlHTMLAttributes<any>
}) => {
  return (
    <>
      {loading || !provider ? (
        <Skeleton isDark width={size} height={size} borderRadius="50%" marginTop="7px" />
      ) : (
        <Image alt={`${provider}-logo`} src={PROVIDER_ICONS[provider]} width={size} height={size} />
      )}
    </>
  )
}

export const EvmLogo = ({ mode, currency, size = 24 }: { mode: string; currency: Token; size?: number }) => {
  return (
    <>
      {mode === 'onramp-fiat' ? (
        <FiatLogo currency={currency} size={`${size - 3}px`} />
      ) : (
        <Box width={`${size}px`} height={`${size}px`}>
          <TokenImageWithBadge
            width={size}
            height={size}
            primarySrc={getImageUrlFromToken(currency)}
            chainId={currency.chainId}
          />
        </Box>
      )}
    </>
  )
}
export const BtcLogo = () => <Image src="/images/btc.svg" alt="bitcoin-logo" width={24} height={24} />

export const OnRampCurrencyLogo = ({ mode, currency, size = 28 }: { mode: string; currency: Token; size?: number }) => {
  const isBtc = isNativeBtc(currency)
  return isBtc ? <BtcLogo /> : <EvmLogo mode={mode} currency={currency as Token} size={size} />
}

export default OnRampProviderLogo
