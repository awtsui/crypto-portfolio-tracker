import {
    Erc20Balance,
    Erc20BalancesRecord,
    EtherBalancesRecord,
    TransactionData,
    TransactionDataRecord,
} from '@/types'
import getSelectedErc20Balance, {
    getSelectedEtherBalance,
    getSelectedPortfolioTransactions,
} from '@/utils/client-helper'
import { useEffect, useState } from 'react'

export default function useSelectedPortfolioValues({
    portfolioAddresses,
    selectedAddress,
    erc20Balances,
    etherBalances,
    portfolioTransactions,
}: {
    portfolioAddresses: string[]
    selectedAddress: string
    erc20Balances: Erc20BalancesRecord
    etherBalances: EtherBalancesRecord
    portfolioTransactions: TransactionDataRecord
}) {
    const [selectedErc20Balance, setSelectedErc20Balance] = useState<
        Erc20Balance[]
    >([])
    const [selectedEtherBalance, setSelectedEtherBalance] = useState<number>(0)
    const [selectedPortfolioTransactions, setSelectedPortfolioTransactions] =
        useState<TransactionData[]>([])

    const numOfPortfolioAddresses = portfolioAddresses.length

    useEffect(() => {
        if (
            Object.keys(portfolioTransactions).length ===
            numOfPortfolioAddresses
        ) {
            setSelectedPortfolioTransactions(
                getSelectedPortfolioTransactions(
                    portfolioAddresses,
                    selectedAddress,
                    portfolioTransactions
                )
            )
        }
    }, [
        JSON.stringify(selectedAddress),
        JSON.stringify(portfolioAddresses),
        JSON.stringify(portfolioTransactions),
    ])

    useEffect(() => {
        if (Object.keys(etherBalances).length === numOfPortfolioAddresses) {
            setSelectedEtherBalance(
                getSelectedEtherBalance(
                    portfolioAddresses,
                    selectedAddress,
                    etherBalances
                )
            )
        }
    }, [
        JSON.stringify(selectedAddress),
        JSON.stringify(portfolioAddresses),
        JSON.stringify(etherBalances),
    ])

    useEffect(() => {
        if (Object.keys(erc20Balances).length === numOfPortfolioAddresses) {
            setSelectedErc20Balance(
                getSelectedErc20Balance(
                    portfolioAddresses,
                    selectedAddress,
                    erc20Balances
                )
            )
        }
    }, [
        JSON.stringify(selectedAddress),
        JSON.stringify(portfolioAddresses),
        JSON.stringify(erc20Balances),
    ])
    return {
        selectedErc20Balance,
        selectedEtherBalance,
        selectedPortfolioTransactions,
    }
}
