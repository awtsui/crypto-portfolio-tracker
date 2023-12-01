/**
 * Fetches ERC-20 token prices, identified with contract address
 */

import { NextRequest, NextResponse } from 'next/server'
import { getGeckoClient } from '@/utils/coingecko'
import { FETCH_PARAM_SIZE } from '@/constants'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const contractAddresses = searchParams.get('contract_addresses')
    const vsCurrencies = searchParams.get('vs_currencies')
    if (!vsCurrencies || !contractAddresses) {
        return NextResponse.json(
            { error: '/api/coingecko/token-prices parameters not defined' },
            { status: 400 }
        )
    }

    try {
        const geckoClient = getGeckoClient()
        let contractAddressArray = contractAddresses.split(',')
        let data = {}
        let fetchIndex = 0
        while (fetchIndex * FETCH_PARAM_SIZE < contractAddressArray.length) {
            const startIndex = fetchIndex * FETCH_PARAM_SIZE
            const endIndex = startIndex + FETCH_PARAM_SIZE
            const resp = await geckoClient.simpleTokenPrice({
                id: 'ethereum',
                contract_addresses: contractAddressArray
                    .slice(startIndex, endIndex)
                    .join(','),
                vs_currencies: vsCurrencies,
            })
            data = {
                ...data,
                ...resp,
            }
            fetchIndex += 1
        }

        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: `Internal Server Error ${error}` },
            { status: 500 }
        )
    }
}
