import { ETHEREUM_BLOCKS_PER_DAY, TimePeriodToDays } from '@/constants'
import { TimePeriod, TransactionDataRecord } from '@/types'
import { getAlchemy } from '@/utils/alchemysdk'
import { formatPortfolioTransaction } from '@/utils/client-helper'
import { Alchemy, AssetTransfersCategory } from 'alchemy-sdk'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function usePortfolioTransactions(portfolioAddresses: string[]) {
    const alchemy = getAlchemy()

    const defaultTransactionData = portfolioAddresses.map((addr) => [addr, []])

    const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0)
    // const [prevBlockNumber, setPrevBlockNumber] = useState<number>(0)
    const [newTransactions, setNewTransactions] =
        useState<TransactionDataRecord>(
            Object.fromEntries(defaultTransactionData)
        )

    const [transactionsLoaded, setTransactionsLoaded] = useState(true)
    const blockNumberFetcher = (client: Alchemy) => client.core.getBlockNumber()
    const blockNumberResp = useSWR(alchemy, blockNumberFetcher)

    useEffect(() => {
        if (blockNumberResp.data && transactionsLoaded) {
            // setPrevBlockNumber(latestBlockNumber + 1)
            setLatestBlockNumber(blockNumberResp.data)
            setTransactionsLoaded(false)
        }
    }, [JSON.stringify(blockNumberResp)])

    useEffect(() => {
        if (!transactionsLoaded) {
            const fetchPromises = portfolioAddresses.map(
                async (portfolioAddress) => {
                    alchemy.core
                        .getAssetTransfers({
                            fromBlock: `0x${(
                                latestBlockNumber -
                                TimePeriodToDays[TimePeriod.ONE_YEAR] *
                                    ETHEREUM_BLOCKS_PER_DAY
                            ).toString(16)}`,
                            toBlock: `0x${latestBlockNumber.toString(16)}`,
                            category: [
                                AssetTransfersCategory.EXTERNAL,
                                AssetTransfersCategory.INTERNAL,
                                AssetTransfersCategory.ERC20,
                            ],
                            fromAddress: portfolioAddress,
                            excludeZeroValue: true,
                            withMetadata: true,
                        })
                        .then((resp) => {
                            setNewTransactions((prev) => {
                                if (
                                    !Object.keys(prev).includes(
                                        portfolioAddress
                                    )
                                ) {
                                    prev[portfolioAddress] = []
                                }
                                return {
                                    ...prev,
                                    [portfolioAddress]: prev[
                                        portfolioAddress
                                    ].concat(
                                        formatPortfolioTransaction(
                                            resp,
                                            portfolioAddresses
                                        )
                                    ),
                                }
                            })
                        })

                    alchemy.core
                        .getAssetTransfers({
                            fromBlock: `0x${(
                                latestBlockNumber -
                                TimePeriodToDays[TimePeriod.ONE_YEAR] *
                                    ETHEREUM_BLOCKS_PER_DAY
                            ).toString(16)}`,
                            toBlock: `0x${latestBlockNumber.toString(16)}`,
                            category: [
                                AssetTransfersCategory.EXTERNAL,
                                AssetTransfersCategory.INTERNAL,
                                AssetTransfersCategory.ERC20,
                            ],
                            toAddress: portfolioAddress,
                            excludeZeroValue: true,
                            withMetadata: true,
                        })
                        .then((resp) =>
                            setNewTransactions((prev) => {
                                if (
                                    !Object.keys(prev).includes(
                                        portfolioAddress
                                    )
                                ) {
                                    prev[portfolioAddress] = []
                                }
                                return {
                                    ...prev,
                                    [portfolioAddress]: prev[
                                        portfolioAddress
                                    ].concat(
                                        formatPortfolioTransaction(
                                            resp,
                                            portfolioAddresses
                                        )
                                    ),
                                }
                            })
                        )
                }
            )
            Promise.all(fetchPromises)

            setTransactionsLoaded(true)
        }
    }, [latestBlockNumber, JSON.stringify(portfolioAddresses)])
    return { newTransactions }
}

function formatGetAssetTransferUrl({
    fromBlock,
    toBlock,
    fromAddress,
    toAddress,
}: {
    fromBlock: number
    toBlock: number
    fromAddress: string | null
    toAddress: string | null
}) {
    const url = new URL('http://localhost:3000/api/alchemy/asset-transfers')
    url.searchParams.set('fromBlock', `0x${fromBlock.toString(16)}`)
    url.searchParams.set('toBlock', `0x${toBlock.toString(16)}`)
    url.searchParams.set('fromAddress', fromAddress ?? '')
    url.searchParams.set('toAddress', toAddress ?? '')
    return url.toString()
}
