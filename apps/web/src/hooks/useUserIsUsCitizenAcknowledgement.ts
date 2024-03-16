/* eslint-disable react-hooks/rules-of-hooks */
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export enum IdType {
  IFO = 'ifo',
  PERPETUALS = 'perpetuals',
}

const perpetuals = atomWithStorage('pcs:NotUsCitizenAcknowledgement-perpetuals', false)
const ifo = atomWithStorage<boolean>('pcs:NotUsCitizenAcknowledgement-ifo', false)

export function useUserNotUsCitizenAcknowledgement(id: IdType) {
  switch (id) {
    case IdType.IFO:
      return useAtom(ifo)
    default:
      return useAtom(perpetuals)
  }
}
