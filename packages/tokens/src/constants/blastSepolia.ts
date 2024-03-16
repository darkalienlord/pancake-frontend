import { ChainId } from '@pancakeswap/chains'
import { ERC20Token, WETH9 } from '@pancakeswap/sdk'

export const blastSepoliaTokens = {
  weth: WETH9[ChainId.BLAST_SEPOLIA],
  usdb: new ERC20Token(
    ChainId.BLAST_SEPOLIA,
    '0x4200000000000000000000000000000000000022',
    18,
    'USDB',
    'USD Blast Token',
    'https://www.blast.io/',
  ),
  cbr: new ERC20Token(
    ChainId.BLAST_SEPOLIA,
    '0xE070B87c4d88826D4cD1b85BAbE186fdB14CD321',
    18,
    'CBR',
    'Cyberblast Token',
    'https://www.cyberblast.io/',
  ),
}
