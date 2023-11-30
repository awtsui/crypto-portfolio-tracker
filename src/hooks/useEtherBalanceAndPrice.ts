import { REFRESH_RATE } from '@/constants'
import { EtherBalancesRecord } from '@/types'
import { getAlchemy } from '@/utils/alchemysdk'
import { fetcher } from '@/utils/fetcher'
import { Utils } from 'alchemy-sdk'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function useEtherBalanceAndPrice(
    portfolioAddresses: string[],
    addressDirectory: Record<string, string>
) {
    const alchemy = getAlchemy()
    const [etherBalances, setEtherBalance] = useState<EtherBalancesRecord>({})
    const [etherPrice, setEtherPrice] = useState<number>(0)

    useEffect(() => {
        if (
            Object.keys(portfolioAddresses).length ===
            Object.keys(addressDirectory).length
        ) {
            const fetchPromises = portfolioAddresses.map(
                async (portfolioAddress) => {
                    if (
                        !Object.keys(etherBalances).includes(portfolioAddress)
                    ) {
                        alchemy.core
                            .getBalance(addressDirectory[portfolioAddress])
                            .then((resp) => {
                                setEtherBalance((prev) => ({
                                    ...prev,
                                    [portfolioAddress]: parseFloat(
                                        Utils.formatEther(resp)
                                    ),
                                }))
                            })
                    }
                }
            )
            Promise.all(fetchPromises)
        }
    }, [JSON.stringify(portfolioAddresses), addressDirectory.length])

    const etherPriceUrl = new URL('http://localhost:3000/api/coingecko/price')
    etherPriceUrl.searchParams.set('ids', 'ethereum')
    etherPriceUrl.searchParams.set('vs_currencies', 'usd')
    const etherPriceResp = useSWR(etherPriceUrl.toString(), fetcher, {
        refreshInterval: REFRESH_RATE,
    })

    useEffect(() => {
        if (
            etherPriceResp.data &&
            etherPriceResp.data.ethereum &&
            etherPriceResp.data.ethereum.usd
        ) {
            setEtherPrice(etherPriceResp.data.ethereum.usd)
        }
    }, [JSON.stringify(etherPriceResp)])

    return {
        etherBalances: etherBalances,
        etherPrice,
    }
}
