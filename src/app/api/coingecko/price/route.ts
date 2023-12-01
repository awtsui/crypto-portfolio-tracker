/**
 * Fetches current token prices
 */

import { NextRequest, NextResponse } from 'next/server'
import { getGeckoClient } from '@/utils/coingecko'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const ids = searchParams.get('ids')
    const vsCurrencies = searchParams.get('vs_currencies')
    if (!ids || !vsCurrencies) {
        return NextResponse.json(
            { error: '/api/coingecko/price params not defined' },
            { status: 400 }
        )
    }

    try {
        const geckoClient = getGeckoClient()
        const resp = await geckoClient.simplePrice({
            ids: ids,
            vs_currencies: vsCurrencies,
        })
        return NextResponse.json(resp, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: `Internal Server Error ${error}` },
            { status: 500 }
        )
    }
}
