import { ContextApi } from '@pancakeswap/localization'
import memoize from 'lodash/memoize'
import { ASSET_CDN } from './endpoints'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PancakeSwap',
  description: 'Trade, earn, and own crypto on the all-in-one multichain DEX',
  image: `${ASSET_CDN}/web/og/hero.jpg`,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Home') },
      '/swap': { basePath: true, title: t('Exchange'), image: `${ASSET_CDN}/web/og/swap.jpg` },
      '/add': { basePath: true, title: t('Add Liquidity'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      '/remove': { basePath: true, title: t('Remove Liquidity'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      '/liquidity': { title: t('Liquidity'), image: `${ASSET_CDN}/web/og/liquidity.jpg` },
      '/find': { title: t('Import Pool') },
      '/farms': { title: t('Farms'), image: `${ASSET_CDN}/web/og/farms.jpg` },
      '/pools': { title: t('Pools'), image: `${ASSET_CDN}/web/og/pools.jpg` },
      '/info': {
        title: `${t('Overview')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}/web/og/info.jpg`,
      },
      '/info/pairs': {
        title: `${t('Pairs')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}/web/og/info.jpg`,
      },
      '/info/tokens': {
        title: `${t('Tokens')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}/web/og/info.jpg`,
      },
    },
    defaultTitleSuffix: t('PancakeSwap'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta | null => {
    const pathList = getPathList(t)
    const basePath = Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]
    const pathMetadata = pathList.paths[path] ?? (basePath && pathList.paths[basePath])

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
