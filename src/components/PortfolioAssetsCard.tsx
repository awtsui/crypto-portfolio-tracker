/**
 * Displays list of portfolio assets, most valuable at the top, of selected address
 */

import etherLogo from '@/app/public/ethereum-logo.png'
import Image from 'next/image'
import { Erc20Balance, TokenPriceRecord } from '@/types'
import useTokenValues from '@/hooks/useTokenValues'

type PortfolioAssetsCardProps = {
    selectedEtherBalance: number
    selectedErc20Balance: Erc20Balance[]
    erc20Prices: TokenPriceRecord
    etherPrice: number
}

export default function PortfolioAssetsCard({
    selectedEtherBalance,
    selectedErc20Balance,
    etherPrice,
    erc20Prices,
}: PortfolioAssetsCardProps) {
    const { tokenValues } = useTokenValues({
        erc20Prices,
        selectedErc20Balance,
        selectedEtherBalance,
        etherPrice,
    })

    return (
        <div className="gap-2 flex flex-col items-center rounded-xl h-full bg-white shadow-md">
            <div className="px-10 pt-5 text-2xl">Assets</div>
            <div className="px-10 py-5 w-full flex flex-col overflow-auto gap-4">
                {tokenValues.map((tokenValue) => (
                    <div key={tokenValue.name} className="flex flex-col">
                        <hr />
                        <div className="flex mt-3 justify-between items-center w-full">
                            <div className="flex gap-4 justify-betweenl">
                                <div className="relative w-10 h-10 mb-2 rounded-full">
                                    {tokenValue.symbol === 'ETH' ? (
                                        <Image
                                            src={etherLogo}
                                            alt={tokenValue.name || ''}
                                            fill
                                        />
                                    ) : (
                                        <Image
                                            src={tokenValue.logo}
                                            alt={tokenValue.name || ''}
                                            fill
                                        />
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <div>{tokenValue.name}</div>
                                    <div className="flex">
                                        <div>
                                            {tokenValue.balance.toFixed(3)}{' '}
                                            {tokenValue.symbol}{' '}
                                            {tokenValue.price.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>${tokenValue.value.toFixed(2)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
