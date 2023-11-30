import { OwnedToken, RawContract } from 'alchemy-sdk'

export enum TransactionType {
    SENT = 'sent',
    RECEIVED = 'received',
}

export type MapRecord = Record<string, string>
export type ContractBalanceRecord = Record<string, number>
export type IdBalanceRecord = Record<string, number>
export type TokenPriceRecord = Record<string, Record<string, number>>

export type Erc20Balance = {
    contractAddress: string
    balance: number
    name: string
    symbol: string
    decimals: number
    logo: string
}
export type Erc20BalancesRecord = Record<string, OwnedToken[]>
export type EtherBalancesRecord = Record<string, number>

export type TransactionDataRecord = Record<
    string,
    { from: TransactionData[]; to: TransactionData[] }
>

export type TransactionData = {
    transactionType: TransactionType
    from: string
    to: string
    assetContract: RawContract
    asset: string
    value: number
    timestamp: number
    transactionId: string
    decimal: number
}

export type HistoricalData = Record<string, number>
export type HistoricalDataRecord = Record<string, HistoricalData>

type TokenData = {
    symbol: string
    logo: string
    value: number
    name: string
    balance: number
    price: number
}
export type TokenDataArray = TokenData[]

export enum TimePeriod {
    ONE_YEAR = '1Y',
    SIX_MONTH = '6M',
    ONE_MONTH = '1M',
}

export interface TokenInfo {
    tokenId: string
    contractAddress: string
    symbol: string
}

export interface TokenMarketData {
    tokenId: string
    data: {
        dates: number[]
        prices: number[]
    }
}

export interface TokenFilter {
    contractAddress: string
    existsOnEthereumL1: boolean
}
