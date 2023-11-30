import { NextRequest, NextResponse } from 'next/server'
import { getGeckoClient } from '@/utils/coingecko'
import dbConnect from '@/utils/mongodb'
import TokenInfo from '@/models/TokenInfo'
import TokenFilter from '@/models/TokenFilter'

export async function GET(request: NextRequest) {
    try {
        await dbConnect()
        const geckoClient = getGeckoClient()
        const resp = await geckoClient.coinList({ include_platform: true })

        resp.forEach(async (coinData) => {
            // TODO: Add tokenids and relevant info into mongodb
            if (coinData.platforms) {
                if (!Object.keys(coinData.platforms).includes('ethereum')) {
                    Object.values(coinData.platforms).forEach(
                        async (address) => {
                            // console.log(`NOT ETHEREUM: ${address}`)
                            if (address) {
                                await TokenFilter.create({
                                    contractAddress: address,
                                    existsOnEthereumL1: false,
                                })
                            }
                        }
                    )
                } else {
                    if (coinData.id && coinData.symbol) {
                        // console.log(
                        //     `ETHEREUM: ${coinData.platforms['ethereum']}`
                        // )
                        if (coinData.platforms['ethereum'].length) {
                            await TokenInfo.create({
                                tokenId: coinData.id,
                                contractAddress: coinData.platforms['ethereum'],
                                symbol: coinData.symbol,
                            })
                            await TokenFilter.create({
                                contractAddress: coinData.platforms['ethereum'],
                                existsOnEthereumL1: true,
                            })
                        }
                    }
                }
            }
        })
        return NextResponse.json({}, { status: 200 })
    } catch (error) {
        return NextResponse.json(
            { error: `Internal Server Error ${error}` },
            { status: 500 }
        )
    }
}
