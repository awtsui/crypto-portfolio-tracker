'use client'

import { useEffect } from 'react'
import PortfolioAssetsCard from './PortfolioAssetsCard'
import PortfolioBalanceCard from './PortfolioBalanceCard'
import PortfolioTransactionsCard from './PortfolioTransactionsCard'
import DropdownMenu from './DropdownMenu'
import { usePortfolio } from '@/context/PortfolioContextProvider'
import useEtherBalanceAndPrice from '@/hooks/useEtherBalanceAndPrice'
import useErc20BalancesAndPrices from '@/hooks/useErc20BalancesAndPrices'
import usePortfolioTransactions from '@/hooks/usePortfolioTransactions'
import { PortfolioValueChartCard } from './PortfolioValueChartCard'
import useSelectedPortfolioValues from '@/hooks/useSelectedPortfolioValues'

export default function PortfolioCard() {
    const {
        portfolioAddresses,
        portfolioTransactions,
        addPortfolioTransactions,
        selectedAddress,
        addressDirectory,
        hashPortfolioAddress,
    } = usePortfolio()
    const { etherBalances, etherPrice } = useEtherBalanceAndPrice(
        portfolioAddresses,
        addressDirectory
    )
    const { erc20Balances, erc20Prices, erc20IdConverter } =
        useErc20BalancesAndPrices(portfolioAddresses, addressDirectory)

    const { newTransactions } = usePortfolioTransactions(
        portfolioAddresses,
        addressDirectory
    )

    const {
        selectedErc20Balance,
        selectedEtherBalance,
        selectedPortfolioTransactions,
    } = useSelectedPortfolioValues({
        portfolioAddresses,
        selectedAddress,
        erc20Balances,
        etherBalances,
        portfolioTransactions,
    })

    useEffect(() => {
        addPortfolioTransactions(newTransactions)
    }, [JSON.stringify(newTransactions)])

    useEffect(() => {
        if (
            Object.keys(erc20Balances).length ===
                Object.keys(etherBalances).length &&
            Object.keys(etherBalances).length ===
                Object.keys(portfolioAddresses).length &&
            Object.keys(portfolioAddresses).length ===
                portfolioAddresses.length &&
            Object.keys(addressDirectory).includes(selectedAddress)
        ) {
            console.log(`LOG: Loading complete, now hashing ${selectedAddress}`)
            hashPortfolioAddress(selectedAddress)
            console.log(
                `LOG: Hash complete --> ${addressDirectory[selectedAddress]}}`
            )
        }
    }, [
        JSON.stringify(erc20Balances),
        JSON.stringify(etherBalances),
        JSON.stringify(portfolioTransactions),
        selectedAddress,
        JSON.stringify(portfolioAddresses),
        addressDirectory.length,
    ])

    return (
        <div className="flex flex-col w-screen items-center gap-6">
            <div className="flex flex-col max-w-[1000px] w-full items-start gap-3 pt-5">
                <div className="flex w-full justify-between items-center">
                    <div className="p-5 text-black bg-white shadow-md rounded-2xl">
                        <PortfolioBalanceCard
                            etherPrice={etherPrice}
                            erc20Prices={erc20Prices}
                            selectedEtherBalance={selectedEtherBalance}
                            selectedErc20Balance={selectedErc20Balance}
                        />
                    </div>
                    <div className="bg-white align text-black rounded-xl shadow-md">
                        <DropdownMenu />
                    </div>
                </div>

                <div className="w-full p-5 bg-white shadow-md rounded-2xl">
                    <PortfolioValueChartCard
                        etherPrice={etherPrice}
                        erc20Prices={erc20Prices}
                        selectedEtherBalance={selectedEtherBalance}
                        selectedErc20Balance={selectedErc20Balance}
                        erc20IdConverter={erc20IdConverter}
                        selectedPortfolioTransactions={
                            selectedPortfolioTransactions
                        }
                    />
                </div>
            </div>
            <div className="flex w-full max-w-[1000px] gap-6 pb-20 max-h-[600px]">
                <div className="flex-auto">
                    <PortfolioAssetsCard
                        etherPrice={etherPrice}
                        erc20Prices={erc20Prices}
                        selectedEtherBalance={selectedEtherBalance}
                        selectedErc20Balance={selectedErc20Balance}
                    />
                </div>
                <div className="flex-auto">
                    <PortfolioTransactionsCard
                        selectedPortfolioTransactions={
                            selectedPortfolioTransactions
                        }
                    />
                </div>
            </div>
        </div>
    )
}
