import shuffle from 'lodash/shuffle'
import { ReactElement, useMemo } from 'react'
import { GalxeTraverseBanner } from '../GalxeTraverseBanner'
import GameBanner from '../GameBanner'
import { NemesisDownfallBanner } from '../NemesisDownfallBanner'
import PerpetualBanner from '../PerpetualBanner'
import { TopTraderBanner } from '../TopTraderBanner'
import { V4InfoBanner } from '../V4InfoBanner'
import VeCakeBanner from '../VeCakeBanner'
import WebNotificationBanner from '../WebNotificationBanner'

interface IBannerConfig {
  shouldRender: boolean
  banner: ReactElement
}

/**
 * make your custom hook to control should render specific banner or not
 * add new campaign banner easily
 *
 * @example
 * ```ts
 *  {
 *    shouldRender: isRenderIFOBanner,
 *    banner: <IFOBanner />,
 *  },
 * ```
 */

export const useMultipleBannerConfig = () => {
  return useMemo(() => {
    const NO_SHUFFLE_BANNERS: IBannerConfig[] = [
      {
        shouldRender: true,
        banner: <V4InfoBanner />,
      },
      {
        shouldRender: true,
        banner: <NemesisDownfallBanner />,
      },
      {
        shouldRender: true,
        banner: <TopTraderBanner />,
      },
    ]

    const SHUFFLE_BANNERS: IBannerConfig[] = [
      { shouldRender: true, banner: <GalxeTraverseBanner /> },
      { shouldRender: true, banner: <WebNotificationBanner /> },
      { shouldRender: true, banner: <VeCakeBanner /> },
      { shouldRender: true, banner: <GameBanner /> },
      {
        shouldRender: true,
        banner: <PerpetualBanner />,
      },
    ]
    return [...NO_SHUFFLE_BANNERS, ...shuffle(SHUFFLE_BANNERS)]
      .filter((bannerConfig: IBannerConfig) => bannerConfig.shouldRender)
      .map((bannerConfig: IBannerConfig) => bannerConfig.banner)
  }, [])
}
