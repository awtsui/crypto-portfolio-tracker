/**
 * Fetches historical market prices for all tokens on every portfolio
 */

import { TimePeriodToDays } from '@/constants'
import { HistoricalDataRecord, MapRecord, TimePeriod } from '@/types'
import { updateHistoricalData } from '@/utils/client-helper'
import { useEffect, useState } from 'react'

export default function useMarketData(tokenIdConverter: MapRecord) {
    const [marketData, setMarketData] = useState<HistoricalDataRecord>({})

    useEffect(() => {
        if (Object.keys(tokenIdConverter).length === 0) {
            return
        }
        const allTokenIds = Object.values(tokenIdConverter).concat(['ethereum'])

        const fetchPromises = allTokenIds.map(async (tokenId) => {
            const url = formatMarketDataUrl({
                id: tokenId,
                days: TimePeriodToDays[TimePeriod.ONE_YEAR].toString(),
                interval: 'daily',
                vsCurrency: 'usd',
            })
            fetch(url, {
                method: 'GET',
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setMarketData((prev) => ({
                        ...prev,
                        [tokenId]: updateHistoricalData({
                            fetchedData: data,
                            tokenId: tokenId,
                        }),
                    }))
                })
                .catch((error) => console.log('Swallowed error'))
        })

        Promise.all(fetchPromises)
    }, [JSON.stringify(tokenIdConverter)])

    return { marketData }
}

function formatMarketDataUrl({
    id,
    days,
    vsCurrency,
    interval,
}: {
    id: string
    days: string
    vsCurrency: string
    interval: string
}) {
    const url = new URL('http://localhost:3000/api/coingecko/market-data')
    url.searchParams.set('id', id)
    url.searchParams.set('days', days)
    url.searchParams.set('vs_currency', vsCurrency)
    url.searchParams.set('interval', interval)
    return url.toString()
}
