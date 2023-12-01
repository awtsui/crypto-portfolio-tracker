'use client'

/**
 * Displays change in portfolio value over time for selected address
 */

import {
    MapRecord,
    TimePeriod,
    TransactionData,
    TokenPriceRecord,
    Erc20Balance,
} from '@/types'
import { useState } from 'react'
import { TimePeriodMenu } from './TimePeriodMenu'
import { extractErc20Balance } from '@/utils/client-helper'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import type { ChartOptions } from 'chart.js'
import useMarketData from '@/hooks/useMarketData'
import useCurrentBalance from '@/hooks/useCurrentBalance'
import useDateRange from '@/hooks/useDateRange'
import useHistoricalValues from '@/hooks/useHistoricalValues'
import useChartData from '@/hooks/useChartData'

const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    scales: {
        y: {
            beginAtZero: true,
        },
        x: {
            ticks: {
                maxTicksLimit: 10,
            },
        },
    },
}

// Relevant data:
// Array<date> --> labels and range of chosen period
// Dictionary<date, <token id, price>> --> Quick access to historical price data
// Dictionary<token id, balance> --> Serves as snapshot of address balance
// Array<transactionData> --> past transactions at specified wallet

type PortfolioValueChartCardProps = {
    erc20Prices: TokenPriceRecord
    etherPrice: number
    selectedEtherBalance: number
    selectedErc20Balance: Erc20Balance[]
    erc20IdConverter: MapRecord
    selectedPortfolioTransactions: TransactionData[]
}

export function PortfolioValueChartCard({
    erc20Prices,
    selectedErc20Balance,
    etherPrice,
    selectedEtherBalance,
    erc20IdConverter,
    selectedPortfolioTransactions,
}: PortfolioValueChartCardProps) {
    const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>(
        TimePeriod.ONE_YEAR
    )

    const { marketData } = useMarketData(erc20IdConverter)

    let currentValue = etherPrice * selectedEtherBalance
    const extractedErc20Balances = extractErc20Balance(selectedErc20Balance)

    for (let key in erc20Prices) {
        currentValue += erc20Prices[key].usd * extractedErc20Balances[key]
    }

    const { dateArray } = useDateRange()

    const { startingBalance } = useCurrentBalance({
        selectedErc20Balance,
        selectedEtherBalance,
        erc20IdConverter,
    })

    const { historicalValueArray } = useHistoricalValues({
        marketData,
        selectedPortfolioTransactions,
        startingBalance,
        dateArray,
        erc20IdConverter,
        currentValue,
    })

    const { chartData } = useChartData({
        historicalValueArray,
        selectedTimePeriod,
        dateArray,
    })

    return (
        <div className="flex flex-col items-end">
            <TimePeriodMenu
                selectedTimePeriod={selectedTimePeriod}
                setSelectedTimePeriod={setSelectedTimePeriod}
            />
            <Line className="" data={chartData} options={chartOptions} />
        </div>
    )
}
