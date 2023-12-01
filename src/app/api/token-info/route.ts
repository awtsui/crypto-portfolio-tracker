/**
 * Fetches MongoDB for token's ID used in CoinGecko
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/utils/mongodb'
import TokenInfo from '@/models/TokenInfo'
import { TokenInfo as TokenInfoInterface } from '@/types'
import { filterTokenIds } from '@/utils/server-helper'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    let contracts = searchParams.get('contracts')
    if (!contracts) {
        return NextResponse.json(
            { error: '/api//token-info parameters not defined' },
            { status: 400 }
        )
    }
    try {
        await dbConnect()
        let contractsArray = contracts.split(',')
        const ids: { [key: string]: string } = {}

        // Checks mongo for a cached receipt of whether coingecko provides necessary info

        contractsArray = await filterTokenIds({ contracts: contractsArray })

        const tokenInfos: TokenInfoInterface[] = await TokenInfo.find({
            contractAddress: { $in: contractsArray },
        })
        if (tokenInfos.length > 0) {
            tokenInfos.forEach((tokenInfo) => {
                ids[tokenInfo.contractAddress] = tokenInfo.tokenId
            })
        }

        if (contractsArray.length === Object.keys(ids).length) {
            console.log(
                `Found cached ${Object.values(ids).join(',')} token id data`
            )
            return NextResponse.json(ids, { status: 200 })
        }

        return NextResponse.json(ids, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: `Internal Server Error ${error}` },
            { status: 500 }
        )
    }
}
