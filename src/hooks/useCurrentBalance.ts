import { Erc20Balance, IdBalanceRecord, MapRecord } from '@/types'
import { extractErc20Balance, switchAddressToId } from '@/utils/client-helper'
import { useEffect, useState } from 'react'

type useCurrentBalanceProps = {
    selectedErc20Balance: Erc20Balance[]
    selectedEtherBalance: number
    erc20IdConverter: MapRecord
}

export default function useCurrentBalance({
    selectedErc20Balance,
    selectedEtherBalance,
    erc20IdConverter,
}: useCurrentBalanceProps) {
    const [startingBalance, setStartingBalance] = useState<IdBalanceRecord>({})

    useEffect(() => {
        const extractedErc20Balances = switchAddressToId(
            extractErc20Balance(selectedErc20Balance),
            erc20IdConverter
        )
        setStartingBalance({
            ...extractedErc20Balances,
            ethereum: selectedEtherBalance,
        })
    }, [
        JSON.stringify(selectedErc20Balance),
        selectedEtherBalance,
        JSON.stringify(erc20IdConverter),
    ])

    return { startingBalance }
}
