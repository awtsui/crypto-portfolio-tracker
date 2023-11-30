import {
    HistoricalDataRecord,
    IdBalanceRecord,
    MapRecord,
    TransactionData,
} from '@/types'
import { generateHistoricalValue } from '@/utils/client-helper'
import { useEffect, useState } from 'react'

type useHistoricalValuesProps = {
    marketData: HistoricalDataRecord
    selectedPortfolioTransactions: TransactionData[]
    startingBalance: IdBalanceRecord
    dateArray: number[]
    erc20IdConverter: MapRecord
    currentValue: number
}

export default function useHistoricalValues({
    marketData,
    selectedPortfolioTransactions,
    startingBalance,
    dateArray,
    erc20IdConverter,
    currentValue,
}: useHistoricalValuesProps) {
    const [historicalValueArray, setHistoricalValueArray] = useState<number[]>(
        []
    )
    useEffect(() => {
        if (
            Object.keys(marketData).length &&
            Object.keys(erc20IdConverter).length &&
            selectedPortfolioTransactions &&
            dateArray.length &&
            Object.keys(startingBalance).length
        ) {
            setHistoricalValueArray(
                generateHistoricalValue({
                    selectedPortfolioTransactions,
                    startingBalance,
                    marketData,
                    erc20IdConverter,
                    dateArray,
                }).concat([currentValue])
            )
        }
    }, [
        JSON.stringify(marketData),
        JSON.stringify(selectedPortfolioTransactions),
        JSON.stringify(startingBalance),
        dateArray.length,
        JSON.stringify(erc20IdConverter),
        currentValue,
    ])
    return { historicalValueArray }
}
