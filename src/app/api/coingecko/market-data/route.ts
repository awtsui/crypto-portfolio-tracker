/**
 * Fetches historical token prices from CoinGecko
 * First checks if MongoDB Cloud contains prices like a cache
 * Fetches from CoinGecko if database is lacking and updates database
 */

import { NextRequest, NextResponse } from 'next/server'
import { getGeckoClient } from '@/utils/coingecko'
import dbConnect from '@/utils/mongodb'
import { TokenMarketData as TokenMarketDataInterface } from '@/types'
import TokenMarketData from '@/models/TokenMarketPrice'

const DAYS_IN_MILLI_SEC = 24 * 60 * 60 * 1000

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const vsCurrency = searchParams.get('vs_currency')
    const days = searchParams.get('days')
    const interval = searchParams.get('interval') || 'daily'
    if (!id || !vsCurrency || !days || !interval) {
        return NextResponse.json(
            { error: '/api/coingecko/market-data params not defined' },
            { status: 400 }
        )
    }

    try {
        await dbConnect()

        let result: Array<Array<number>> = []
        const daysInt = parseInt(days)
        let cacheFound = false
        const tokenMarketData: TokenMarketDataInterface | null =
            await TokenMarketData.findOne({
                tokenId: id,
            })
        if (tokenMarketData) {
            result = tokenMarketData.data.dates
                .slice(-daysInt)
                .map((a, i) => [
                    a,
                    tokenMarketData.data.prices.slice(-daysInt)[i],
                ])
            cacheFound = true
        }

        let cachedDiff = daysInt

        const now = Date.now()
        const latestCache = result.at(-1)?.at(0)
        if (result.length && latestCache) {
            cachedDiff = Math.floor((now - latestCache) / DAYS_IN_MILLI_SEC)
        }
        if (cachedDiff === 0) {
            console.log(`Found cached ${id} market data`)
            return NextResponse.json(result, { status: 200 })
        }

        const geckoClient = getGeckoClient()
        const resp = await geckoClient.coinIdMarketChart({
            id,
            vs_currency: vsCurrency,
            days: cachedDiff,
            interval,
        })

        let newMarketData: [number[], number[]] = [[], []]
        resp.prices.slice(0, -1).forEach(([date, price]) => {
            result.push([date, price])
            newMarketData[0].push(date)
            newMarketData[1].push(price)
        })

        if (cacheFound) {
            await TokenMarketData.findOneAndUpdate(
                { tokenId: id },
                {
                    $push: {
                        'data.dates': { $each: newMarketData[0] },
                        'data.prices': { $each: newMarketData[1] },
                    },
                }
            )
        } else {
            await TokenMarketData.create({
                tokenId: id,
                data: {
                    dates: newMarketData[0],
                    prices: newMarketData[1],
                },
            })
        }

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: `Internal Server Error ${error}` },
            { status: 500 }
        )
    }
}
