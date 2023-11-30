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
        <div className="flex flex-col gap-2 overflow-auto max-h-[350px]">
            {tokenValues.map((tokenValue) => (
                <div key={tokenValue.name}>
                    <hr />
                    <div className="flex mt-3 justify-between items-center">
                        <div className="flex gap-4">
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
    )
}
