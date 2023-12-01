/**
 * Retrieves transactions for the newly added portfolio address, maintains record
 * of previously added portfolios, and keeps data stored under specific portfolio address
 */

import { ETHEREUM_BLOCKS_PER_DAY, TimePeriodToDays } from '@/constants'
import { TimePeriod, TransactionDataRecord } from '@/types'
import { getAlchemy } from '@/utils/alchemysdk'
import { formatPortfolioTransaction } from '@/utils/client-helper'
import { AssetTransfersCategory } from 'alchemy-sdk'
import { useEffect, useState } from 'react'

export default function usePortfolioTransactions(
    portfolioAddresses: string[],
    addressDirectory: Record<string, string>
) {
    const alchemy = getAlchemy()

    const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0)
    const [newTransactions, setNewTransactions] =
        useState<TransactionDataRecord>({})

    useEffect(() => {
        alchemy.core.getBlockNumber().then((resp) => setLatestBlockNumber(resp))
    }, [])

    useEffect(() => {
        if (
            latestBlockNumber > 0 &&
            Object.keys(portfolioAddresses).length ===
                Object.keys(addressDirectory).length
        ) {
            const fetchPromises = portfolioAddresses.map(
                async (portfolioAddress) => {
                    if (
                        !Object.keys(newTransactions).includes(portfolioAddress)
                    ) {
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
                                fromAddress: addressDirectory[portfolioAddress],
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
                                        prev[portfolioAddress] = {
                                            to: [],
                                            from: [],
                                        }
                                    }
                                    return {
                                        ...prev,
                                        [portfolioAddress]: {
                                            ...prev[portfolioAddress],
                                            from: formatPortfolioTransaction(
                                                resp,
                                                portfolioAddress,
                                                addressDirectory
                                            ),
                                        },
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
                                toAddress: addressDirectory[portfolioAddress],
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
                                        prev[portfolioAddress] = {
                                            to: [],
                                            from: [],
                                        }
                                    }
                                    return {
                                        ...prev,
                                        [portfolioAddress]: {
                                            ...prev[portfolioAddress],
                                            to: formatPortfolioTransaction(
                                                resp,
                                                portfolioAddress,
                                                addressDirectory
                                            ),
                                        },
                                    }
                                })
                            )
                    }
                }
            )
            Promise.all(fetchPromises)
        }
    }, [
        latestBlockNumber,
        JSON.stringify(portfolioAddresses),
        Object.keys(addressDirectory).length,
    ])
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
