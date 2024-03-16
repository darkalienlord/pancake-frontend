import { useTranslation } from '@pancakeswap/localization'
import { RoiCalculatorModal, Text, TooltipText, useModal, useTooltip } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { MouseEvent, useState } from 'react'

import { useFarmUser } from 'state/farms/hooks'

import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useAccount } from 'wagmi'

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  pid: number
  lpSymbol: string
  lpTokenPrice?: BigNumber
  lpLabel?: string
  multiplier?: string
  cakePrice?: BigNumber
  apr?: number
  displayApr?: string
  lpRewardsApr?: number
  addLiquidityUrl?: string
  strikethrough?: boolean
  useTooltipText?: boolean
  hideButton?: boolean
  boosted?: boolean
  stableSwapAddress?: string
  stableLpFee?: number
  farmCakePerSecond?: string
  totalMultipliers?: string
}

const ApyButton: React.FC<React.PropsWithChildren<ApyButtonProps>> = ({
  variant,
  pid,
  lpLabel,
  lpTokenPrice = BIG_ZERO,
  lpSymbol,
  cakePrice,
  apr = 0,
  multiplier,
  displayApr,
  lpRewardsApr = 0,
  addLiquidityUrl,
  strikethrough,
  useTooltipText,
  hideButton,
  stableSwapAddress,
  stableLpFee,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [bCakeMultiplier] = useState<number | null>(() => null)
  const { tokenBalance, stakedBalance, proxy } = useFarmUser(pid)

  const userBalanceInFarm = stakedBalance.plus(tokenBalance).gt(0)
    ? stakedBalance.plus(tokenBalance)
    : proxy
    ? proxy.stakedBalance.plus(proxy.tokenBalance)
    : BIG_ZERO
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      account={account}
      pid={pid}
      linkLabel={t('Add %symbol%', { symbol: lpLabel })}
      stakingTokenBalance={userBalanceInFarm}
      stakingTokenDecimals={18}
      stakingTokenSymbol={lpSymbol}
      stakingTokenPrice={lpTokenPrice.toNumber()}
      earningTokenPrice={cakePrice?.toNumber() ?? 0}
      apr={bCakeMultiplier ? apr * bCakeMultiplier : apr}
      multiplier={multiplier}
      displayApr={bCakeMultiplier ? (_toNumber(displayApr) - apr + apr * bCakeMultiplier).toFixed(2) : displayApr}
      linkHref={addLiquidityUrl}
      lpRewardsApr={lpRewardsApr}
      isFarm
      stableSwapAddress={stableSwapAddress}
      stableLpFee={stableLpFee}
      farmCakePerSecond={farmCakePerSecond}
      totalMultipliers={totalMultipliers}
    />,
    false,
    true,
    `FarmModal${pid}`,
  )

  const handleClickButton = (event: MouseEvent): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text>
        {t('Combined APR')}:{' '}
        <Text style={{ display: 'inline-block' }} color={strikethrough ? 'secondary' : 'text'} bold>
          {strikethrough ? `${(apr + lpRewardsApr).toFixed(2)}%` : `${displayApr}%`}
        </Text>
      </Text>
      <ul>
        <li>
          {t('Farm APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={strikethrough ? 'secondary' : 'normal'} bold>
            {strikethrough ? `${apr.toFixed(2)}%` : `${apr.toFixed(2)}%`}
          </Text>
        </li>
        <li>
          {t('LP Fee APR')}:{' '}
          <Text style={{ display: 'inline-block' }} color={strikethrough ? 'secondary' : 'normal'} bold>
            {lpRewardsApr === 0 ? '-' : lpRewardsApr}%
          </Text>
        </li>
      </ul>
      {strikethrough && <Text color="secondary">{t('Boost only applies to base APR (CAKE yield)')}</Text>}
    </>,
    {
      placement: 'top',
    },
  )

  return (
    <FarmWidget.FarmApyButton
      variant={variant}
      hideButton={hideButton}
      strikethrough={strikethrough}
      handleClickButton={handleClickButton}
    >
      {useTooltipText ? (
        <>
          <TooltipText ref={targetRef} decorationColor="secondary">
            {displayApr}%
          </TooltipText>
          {tooltipVisible && tooltip}
        </>
      ) : (
        <>{displayApr}%</>
      )}
    </FarmWidget.FarmApyButton>
  )
}

export default ApyButton
