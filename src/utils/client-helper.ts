import {
    ContractBalanceRecord,
    HistoricalDataRecord,
    TransactionData,
    TransactionType,
    MapRecord,
    IdBalanceRecord,
    Erc20BalancesRecord,
    Erc20Balance,
    EtherBalancesRecord,
    TransactionDataRecord,
    HistoricalData,
} from '@/types'
import { AssetTransfersWithMetadataResponse } from 'alchemy-sdk'

export function extractErc20Balance(tokens: Erc20Balance[]) {
    let recordErc20Balance: Record<string, number> = {}
    tokens.forEach((token) => {
        if (token.contractAddress) {
            recordErc20Balance[token.contractAddress] = token.balance
        }
    })
    return recordErc20Balance
}

export function formatPortfolioTransaction(
    resp: AssetTransfersWithMetadataResponse,
    portfolioAddresses: string[]
) {
    const txns: TransactionData[] = []
    resp.transfers.forEach((transfer) => {
        const txn: TransactionData = {
            transactionType: portfolioAddresses.includes(transfer.from)
                ? TransactionType.SENT
                : TransactionType.RECEIVED,
            asset: transfer.asset || '',
            assetContract: transfer.rawContract,
            from: transfer.from,
            to: transfer.to || '',
            value: transfer.value || 0,
            timestamp: new Date(transfer.metadata.blockTimestamp).getTime(),
            transactionId: transfer.uniqueId,
            decimal: parseInt(transfer.rawContract.decimal ?? '18'),
        }
        txns.push(txn)
    })
    return txns
}

export function updateHistoricalData({
    fetchedData,
    tokenId,
}: {
    fetchedData: Array<Array<number>>
    tokenId: string
}) {
    if (!fetchedData.length) return {}

    let result: HistoricalData = {}
    fetchedData.forEach(([epochTimeMilliSec, price]) => {
        result[epochTimeMilliSec] = price
    })
    return result
}

export function convertEpochToDate({
    date,
    includeYear,
}: {
    date: number
    includeYear: boolean
}) {
    const dateObj = new Date(date)
    const month = dateObj.toLocaleString('default', { month: 'short' }) //months from 1-12
    let day = dateObj.getUTCDate()
    let year = dateObj.getUTCFullYear()

    let newDateString = month + ' ' + day
    if (includeYear) {
        newDateString += ', ' + year
    }
    return newDateString
}

export function switchAddressToId(
    record: ContractBalanceRecord,
    ids: MapRecord
) {
    let output: IdBalanceRecord = {}
    Object.keys(record).forEach((key) => {
        output[ids[key]] = record[key]
    })
    return output
}

export default function getSelectedErc20Balance(
    addresses: string[],
    selectedAddress: string,
    erc20Balances: Erc20BalancesRecord
) {
    let erc20BalanceMapping: Record<string, Erc20Balance> = {}
    let selectedErc20Balance: Erc20Balance[] = []
    if (selectedAddress === 'All') {
        addresses.forEach((address) => {
            erc20Balances[address].forEach((ownedToken) => {
                if (
                    ownedToken.name &&
                    ownedToken.symbol &&
                    ownedToken.decimals &&
                    ownedToken.logo
                ) {
                    if (erc20BalanceMapping[ownedToken.contractAddress]) {
                        erc20BalanceMapping[ownedToken.contractAddress] = {
                            ...erc20BalanceMapping[ownedToken.contractAddress],
                            balance:
                                erc20BalanceMapping[ownedToken.contractAddress]
                                    .balance +
                                parseFloat(ownedToken.balance ?? '0'),
                        }
                    } else {
                        erc20BalanceMapping[ownedToken.contractAddress] = {
                            contractAddress: ownedToken.contractAddress,
                            name: ownedToken.name,
                            symbol: ownedToken.symbol,
                            decimals: ownedToken.decimals,
                            logo: ownedToken.logo,
                            balance: parseFloat(ownedToken.balance ?? '0'),
                        }
                    }
                }
            })
        })
        selectedErc20Balance = Object.values(erc20BalanceMapping)
    } else {
        erc20Balances[selectedAddress].forEach((ownedToken) => {
            if (
                ownedToken.name &&
                ownedToken.symbol &&
                ownedToken.decimals &&
                ownedToken.logo
            ) {
                selectedErc20Balance.push({
                    contractAddress: ownedToken.contractAddress,
                    name: ownedToken.name,
                    symbol: ownedToken.symbol,
                    decimals: ownedToken.decimals,
                    logo: ownedToken.logo,
                    balance: parseFloat(ownedToken.balance ?? '0'),
                })
            }
        })
    }
    return selectedErc20Balance
}

export function getSelectedEtherBalance(
    addresses: string[],
    selectedAddress: string,
    etherBalances: EtherBalancesRecord
) {
    let selectedEtherBalance = 0
    if (selectedAddress === 'All') {
        addresses.forEach((address) => {
            selectedEtherBalance += etherBalances[address]
        })
    } else {
        selectedEtherBalance = etherBalances[selectedAddress]
    }
    return selectedEtherBalance
}

export function hideWalletAddress(address: string) {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function getSelectedPortfolioTransactions(
    addresses: string[],
    selectedAddress: string,
    portfolioTransactions: TransactionDataRecord
) {
    let selectedPortfolioTransactions: TransactionData[] = []
    if (selectedAddress === 'All') {
        addresses.forEach((address) => {
            selectedPortfolioTransactions =
                selectedPortfolioTransactions.concat(
                    portfolioTransactions[address]
                )
        })
    } else {
        selectedPortfolioTransactions = portfolioTransactions[selectedAddress]
    }
    selectedPortfolioTransactions.sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1
    )
    return selectedPortfolioTransactions
}

export function generateHistoricalValue({
    selectedPortfolioTransactions,
    startingBalance,
    marketData,
    erc20IdConverter,
    dateArray,
}: {
    selectedPortfolioTransactions: TransactionData[]
    startingBalance: IdBalanceRecord
    marketData: HistoricalDataRecord
    erc20IdConverter: MapRecord
    dateArray: number[]
}) {
    let historicalValues: number[] = []
    let portfolioTransactionIndex = selectedPortfolioTransactions.length - 1
    let snapshotBalance = Object.assign({}, startingBalance)

    dateArray.toReversed().forEach((date) => {
        let snapshotValue = 0
        Object.keys(snapshotBalance).forEach((key) => {
            if (
                Object.keys(marketData).includes(key) &&
                Object.keys(marketData[key]).includes(date.toString())
            ) {
                snapshotValue +=
                    snapshotBalance[key] * marketData[key][date.toString()]
            }
        })

        historicalValues.unshift(snapshotValue > 0 ? snapshotValue : 0)

        while (
            portfolioTransactionIndex >= 0 &&
            date <
                selectedPortfolioTransactions[portfolioTransactionIndex]
                    .timestamp
        ) {
            const transaction =
                selectedPortfolioTransactions[portfolioTransactionIndex]

            if (transaction.assetContract.address) {
                const transactionId =
                    erc20IdConverter[transaction.assetContract.address]

                const changeInErc20Balance =
                    transaction.transactionType === TransactionType.RECEIVED
                        ? -1 * transaction.value
                        : transaction.value
                snapshotBalance[transactionId] += changeInErc20Balance
            } else {
                if (transaction.asset === 'ETH') {
                    const changeInEthBalance =
                        transaction.transactionType === TransactionType.RECEIVED
                            ? -1 * transaction.value
                            : transaction.value
                    snapshotBalance['ethereum'] += changeInEthBalance
                }
            }
            portfolioTransactionIndex -= 1
        }
    })
    return historicalValues
}
