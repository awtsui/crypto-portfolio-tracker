import { Erc20Balance, TokenPriceRecord } from '@/types'

type PortfolioBalanceCardProps = {
    erc20Prices: TokenPriceRecord
    etherPrice: number
    selectedEtherBalance: number
    selectedErc20Balance: Erc20Balance[]
}

export default function PortfolioBalanceCard({
    erc20Prices,
    selectedErc20Balance,
    etherPrice,
    selectedEtherBalance,
}: PortfolioBalanceCardProps) {
    const keysOfErc20Prices = Object.keys(erc20Prices)
    const selectedErc20BalanceLoaded = selectedErc20Balance.reduce(
        (acc, curr) => acc && keysOfErc20Prices.includes(curr.contractAddress),
        true
    )
    if (!selectedErc20BalanceLoaded) return <div>Loading...</div>

    let totalBalance = etherPrice * selectedEtherBalance
    selectedErc20Balance.forEach((tokenBalance) => {
        totalBalance +=
            erc20Prices[tokenBalance.contractAddress].usd * tokenBalance.balance
    })

    return <div className="text-4xl">${totalBalance.toFixed(2)}</div>
}
