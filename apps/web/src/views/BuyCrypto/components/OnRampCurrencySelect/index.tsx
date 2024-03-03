import { useTranslation } from '@pancakeswap/localization'
import { Currency, Token } from '@pancakeswap/sdk'
import { ArrowDropDownIcon, Box, BoxProps, Button, Flex, Skeleton, Text, useModal } from '@pancakeswap/uikit'
import { NumericalInput } from '@pancakeswap/widgets-internal'
import { BtcLogo, EvmLogo } from 'components/SearchModal/OnRampCurrencyList'
import OnRampCurrencySearchModal, { CurrencySearchModalProps } from 'components/SearchModal/OnRampCurrencyModal'
import { ReactNode } from 'react'
import { styled } from 'styled-components'
import { NATIVE_BTC, fiatCurrencyMap, getNetworkDisplay, onRampCurrencies } from 'views/BuyCrypto/constants'

const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px;
  box-shadow: ${({ theme, error }) => (error ? theme.shadows.danger : theme.shadows.inset)};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.failure : theme.colors.inputSecondary)};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  cursor: pointer;
  position: relative;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const OptionSelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
  border-left: ${({ theme }) => `1px solid ${theme.colors.inputSecondary}`};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 130px;
  padding-left: 16px;
  padding-right: 8px;
  border-radius: 0px;
`

const ButtonAsset = ({
  id,
  selectedCurrency,
  currencyLoading,
}: {
  id: string
  selectedCurrency: Currency
  currencyLoading: boolean
}) => {
  const { t } = useTranslation()
  const isBtcNative = selectedCurrency.chainId === NATIVE_BTC.chainId
  return (
    <Flex>
      {isBtcNative ? <BtcLogo /> : <EvmLogo mode={id} currency={selectedCurrency as Token} size={26} />}
      {currencyLoading ? null : (
        <Text id="pair" bold marginLeft="8px">
          {(selectedCurrency && selectedCurrency.symbol && selectedCurrency.symbol.length > 10
            ? `${selectedCurrency.symbol.slice(0, 4)}...${selectedCurrency.symbol.slice(
                selectedCurrency.symbol.length - 5,
                selectedCurrency.symbol.length,
              )}`
            : selectedCurrency?.symbol) || t('Select a currency')}
        </Text>
      )}
    </Flex>
  )
}

interface BuyCryptoSelectorProps extends Omit<CurrencySearchModalProps, 'mode'>, BoxProps {
  id: 'onramp-fiat' | 'onramp-crypto'
  currencyLoading: boolean
  value: string
  onUserInput?: (value: string) => void
  disableCurrencySelect?: boolean
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disabled?: boolean
  loading?: boolean
  topElement?: ReactNode
  bottomElement?: ReactNode
}

export const BuyCryptoSelector = ({
  onCurrencySelect,
  onUserInput,
  onInputBlur,
  selectedCurrency,
  otherSelectedCurrency,
  id,
  currencyLoading,
  topElement,
  error,
  value,
  bottomElement,
  ...props
}: BuyCryptoSelectorProps) => {
  const { t } = useTranslation()
  const tokensToShow = id === 'onramp-fiat' ? Object.values(fiatCurrencyMap) : onRampCurrencies
  const isBtcNative = selectedCurrency && selectedCurrency.chainId === NATIVE_BTC.chainId
  const btcNetworkDisplayName = t('Bitcoin Network')

  const networkDisplay = isBtcNative ? btcNetworkDisplayName : getNetworkDisplay(selectedCurrency?.chainId)

  const [onPresentCurrencyModal] = useModal(
    <OnRampCurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={selectedCurrency}
      otherSelectedCurrency={otherSelectedCurrency}
      tokensToShow={tokensToShow}
      mode={id}
    />,
  )

  return (
    <Box width="100%" {...props}>
      <Flex justifyContent="space-between" py="4px" width="100%" alignItems="center">
        {topElement}
      </Flex>
      <DropDownContainer error={error as any}>
        {id === 'onramp-fiat' ? (
          <NumericalInput
            error={error}
            disabled={!selectedCurrency}
            loading={!selectedCurrency}
            className="token-amount-input"
            value={value}
            onBlur={onInputBlur}
            onUserInput={(val) => {
              onUserInput?.(val)
            }}
            align="left"
          />
        ) : (
          <Text>{networkDisplay}</Text>
        )}
        <OptionSelectButton
          className="open-currency-select-button"
          selected={!!selectedCurrency}
          onClick={onPresentCurrencyModal}
        >
          {selectedCurrency ? (
            <ButtonAsset id={id} selectedCurrency={selectedCurrency} currencyLoading={currencyLoading} />
          ) : (
            <Flex>
              <Skeleton width="105px" height="26px" variant="round" isDark />
            </Flex>
          )}
          {selectedCurrency && <ArrowDropDownIcon />}
        </OptionSelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" pt="6px" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
