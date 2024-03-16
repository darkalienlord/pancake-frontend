import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const blastTokens = {
  weth: WETH9[ChainId.BLAST],
  usdb: new ERC20Token(
    ChainId.BLAST,
    '0x4300000000000000000000000000000000000003',
    18,
    'USDB',
    'USD Blast Token',
    'https://www.blast.io/',
  ),
  cbr: new ERC20Token(
    ChainId.BLAST,
    '0xE070B87c4d88826D4cD1b85BAbE186fdB14CD321',
    18,
    'CBR',
    'Cyberblast Token',
    'https://www.cyberblast.io/',
  ),
}
