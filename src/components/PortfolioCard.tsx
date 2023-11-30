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
