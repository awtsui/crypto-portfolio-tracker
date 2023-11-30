import { Erc20BalancesRecord, MapRecord, TokenPriceRecord } from '@/types'
import { getAlchemy } from '@/utils/alchemysdk'
import { fetcher } from '@/utils/fetcher'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function useErc20BalancesAndPrices(
    portfolioAddresses: string[]
) {
    const alchemy = getAlchemy()
    const [erc20Balances, setErc20Balances] = useState<Erc20BalancesRecord>({})
    const [erc20Prices, setErc20Prices] = useState<TokenPriceRecord>({})
    const [erc20ContractAddresses, setErc20ContractAddresses] = useState<
        string[]
    >([])
    const [erc20IdConverter, setErc20IdConverter] = useState<MapRecord>({})

    // TODO: Adapt to multiple addresses
    useEffect(() => {
        const fetchPromises = portfolioAddresses.map(
            async (portfolioAdrress) => {
                alchemy.core
                    .getTokensForOwner(portfolioAdrress)
                    .then((resp) => {
                        const tokens = resp.tokens
                        setErc20Balances((prev) => ({
                            ...prev,
                            [portfolioAdrress]: tokens,
                        }))

                        setErc20ContractAddresses((prev) =>
                            prev.concat(
                                tokens
                                    .map((token) => token.contractAddress)
                                    .filter(
                                        (address) => prev.indexOf(address) < 0
                                    )
                            )
                        )
                    })
            }
        )
        Promise.all(fetchPromises)
    }, [JSON.stringify(portfolioAddresses)])

    const erc20PriceUrl = new URL(
        'http://localhost:3000/api/coingecko/token-price'
    )
    erc20PriceUrl.searchParams.set(
        'contract_addresses',
        erc20ContractAddresses.join(',')
    )
    erc20PriceUrl.searchParams.set('vs_currencies', 'usd')
    const erc20PriceResp = useSWR(
        erc20ContractAddresses.length ? erc20PriceUrl.toString() : null,
        fetcher
    )
    const coinIdUrl = new URL('http://localhost:3000/api/token-info')
    coinIdUrl.searchParams.set('contracts', erc20ContractAddresses.join(','))
    const coinIdResp = useSWR(
        erc20ContractAddresses.length ? coinIdUrl.toString() : null,
        fetcher
    )

    useEffect(() => {
        if (erc20PriceResp.data) {
            setErc20Prices(erc20PriceResp.data)
        }
        if (coinIdResp.data) {
            setErc20IdConverter(coinIdResp.data)
        }
    }, [JSON.stringify(erc20PriceResp), JSON.stringify(coinIdResp)])

    return {
        erc20Balances,
        erc20Prices,
        erc20IdConverter,
    }
}
