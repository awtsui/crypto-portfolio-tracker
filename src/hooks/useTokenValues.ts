import { Erc20Balance, TokenDataArray, TokenPriceRecord } from '@/types'
import { useEffect, useState } from 'react'

type useTokenValuesProps = {
    selectedEtherBalance: number
    selectedErc20Balance: Erc20Balance[]
    erc20Prices: TokenPriceRecord
    etherPrice: number
}

export default function useTokenValues({
    selectedEtherBalance,
    selectedErc20Balance,
    etherPrice,
    erc20Prices,
}: useTokenValuesProps) {
    const [tokenValues, setTokenValues] = useState<TokenDataArray>([])
    useEffect(() => {
        const keysOfErc20Prices = Object.keys(erc20Prices)
        const selectedErc20BalanceLoaded = selectedErc20Balance.reduce(
            (acc, curr) =>
                acc && keysOfErc20Prices.includes(curr.contractAddress),
            true
        )
        if (keysOfErc20Prices.length && selectedErc20BalanceLoaded) {
            const newTokenValues = selectedErc20Balance
                .map((tokenBalance) => ({
                    name: tokenBalance.name,
                    symbol: tokenBalance.symbol,
                    logo: tokenBalance.logo,
                    balance: tokenBalance.balance || 0,
                    price: erc20Prices[tokenBalance.contractAddress].usd,
                    value:
                        erc20Prices[tokenBalance.contractAddress].usd *
                        tokenBalance.balance,
                }))
                .concat([
                    {
                        name: 'Ethereum',
                        symbol: 'ETH',
                        logo: '',
                        balance: selectedEtherBalance,
                        price: etherPrice,
                        value: etherPrice * selectedEtherBalance,
                    },
                ])
                .toSorted((a, b) => (a.value > b.value ? -1 : 1))

            setTokenValues(newTokenValues)
        }
    }, [
        JSON.stringify(selectedErc20Balance),
        JSON.stringify(selectedEtherBalance),
        etherPrice,
        JSON.stringify(erc20Prices),
    ])
    return { tokenValues }
}
