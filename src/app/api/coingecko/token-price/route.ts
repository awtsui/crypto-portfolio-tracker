import { NextRequest, NextResponse } from 'next/server'
import { getGeckoClient } from '@/utils/coingecko'

const fetchParamSize = 10

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
        while (fetchIndex * fetchParamSize < contractAddressArray.length) {
            const startIndex = fetchIndex * fetchParamSize
            const endIndex = startIndex + fetchParamSize
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
