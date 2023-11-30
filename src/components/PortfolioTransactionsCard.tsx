import { TransactionData, TransactionType } from '@/types'
import { convertEpochToDate } from '@/utils/client-helper'

type PortfolioTransactionsCardProps = {
    selectedPortfolioTransactions: TransactionData[]
}

export default function PortfolioTransactionsCard({
    selectedPortfolioTransactions,
}: PortfolioTransactionsCardProps) {
    // TODO: Add green or red text/bg color depending on txn type
    console.log(selectedPortfolioTransactions)
    // if (!selectedPortfolioTransactions[0]) return <div>Loading...</div>
    return (
        <div className="flex flex-col w-full bg-white shadow-md h-full rounded-xl items-center gap-2">
            <div className="px-10 pt-5 text-2xl">Transactions</div>
            <div className="px-10 py-5 w-full flex flex-col gap-4  overflow-auto">
                {selectedPortfolioTransactions
                    .toReversed()
                    .slice(0, 40)
                    .map((txn) => (
                        <div className="flex flex-col" key={txn.transactionId}>
                            <hr />
                            <div className="flex justify-between w-full pt-4">
                                <div
                                    className={`capitalize ${
                                        txn.transactionType ===
                                        TransactionType.RECEIVED
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }`}
                                >
                                    {txn.transactionType} {txn.value.toFixed(3)}{' '}
                                    {txn.asset}
                                </div>
                                <div className="text-md text-opacity-50 text-black">
                                    {convertEpochToDate({
                                        date: txn.timestamp,
                                        includeYear: true,
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    )
}

const temp = {
    '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b': {
        usd: 3.6,
    },
    '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490': {
        usd: 1.028,
    },
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': {
        usd: 0.754238,
    },
}
