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
        addresses,
        portfolioTransactions,
        addPortfolioTransactions,
        selectedAddress,
    } = usePortfolio()
    const { etherBalances, etherPrice } = useEtherBalanceAndPrice(addresses)
    const { erc20Balances, erc20Prices, erc20IdConverter } =
        useErc20BalancesAndPrices(addresses)

    const { newTransactions } = usePortfolioTransactions(addresses)

    useEffect(() => {
        addPortfolioTransactions(newTransactions)
    }, [JSON.stringify(newTransactions)])

    const {
        selectedErc20Balance,
        selectedEtherBalance,
        selectedPortfolioTransactions,
    } = useSelectedPortfolioValues({
        portfolioAddresses: addresses,
        selectedAddress,
        erc20Balances,
        etherBalances,
        portfolioTransactions,
    })

    // if (
    //     !Object.keys(erc20Prices).length ||
    //     !selectedErc20Balance.length ||
    //     !selectedEtherBalance ||
    //     !selectedPortfolioTransactions.length ||
    //     !Object.keys(erc20IdConverter).length ||
    //     !etherPrice
    // ) {
    //     return <div>Loading...</div>
    // }

    return (
        <div className="flex h-screen justify-center overflow-y-hidden">
            <div className="flex flex-col min-h-screen max-w-[750px] w-full items-start pl-40 pr-5 pt-10 pb-10 gap-5">
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
                <div className="text-black rounded-2xl w-full px-10 py-6 bg-white shadow-md">
                    <PortfolioAssetsCard
                        etherPrice={etherPrice}
                        erc20Prices={erc20Prices}
                        selectedEtherBalance={selectedEtherBalance}
                        selectedErc20Balance={selectedErc20Balance}
                    />
                </div>
            </div>
            <div className="flex max-w-[600px] w-full pl-5 pr-40 py-20">
                <div className="w-full">
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
