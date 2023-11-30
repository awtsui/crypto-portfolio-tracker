'use client'
import { usePortfolio } from '@/context/PortfolioContextProvider'
import { shortenPortfolioAddress } from '@/utils/client-helper'
import { compareSync } from 'bcrypt-ts/browser'
import { useEffect, useState } from 'react'
import { isAddress } from 'web3-validator'

export default function DropdownMenu() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [formAddress, setFormAddress] = useState('')
    const [newAddress, setNewAddress] = useState('')
    const {
        portfolioAddresses,
        addPortfolioAddress,
        removePortfolioAddress,
        selectedAddress,
        setSelectedAddress,
    } = usePortfolio()
    const menuAddresses = [...portfolioAddresses]

    if (menuAddresses.length === 2) {
        menuAddresses.unshift('All')
    }

    useEffect(() => {
        if (newAddress) {
            addPortfolioAddress(newAddress)
            setSelectedAddress(shortenPortfolioAddress(newAddress))
            menuAddresses.push(shortenPortfolioAddress(newAddress))
        }
    }, [newAddress])

    const handleSetLabel = (address: string) => {
        setSelectedAddress(address)
        setIsOpen(!isOpen)
    }

    const handleAddClick = () => {
        if (
            isAddress(formAddress) &&
            !portfolioAddresses.includes(shortenPortfolioAddress(formAddress))
        ) {
            setNewAddress(formAddress)
        } else {
            console.log('ERR: Invalid wallet address')
        }
        setFormAddress('')
        setIsOpen(!isOpen)
    }
    // const handleDeleteAddress = (address: string) => {
    //     if (selectedAddress === address) {
    //         setSelectedAddress('All')
    //     }
    //     removeAddress(address)
    // }

    return (
        <div className="relative flex flex-col items-start px-5 py-2 gap-2">
            <button
                className="px-2 py-2 flex-grow w-full rounded-lg hover:bg-slate-400"
                onClick={() => setIsOpen(!isOpen)}
            >
                {!selectedAddress
                    ? 'None'
                    : selectedAddress !== 'All'
                    ? selectedAddress
                    : 'All'}
            </button>

            {isOpen && (
                <div className="flex flex-col gap-2">
                    <hr />
                    {menuAddresses.map((address) => (
                        <div key={address}>
                            {address !== selectedAddress && (
                                <div className="flex justify-between">
                                    <button
                                        className="pl-2 hover:bg-slate-400 flex-grow rounded-lg py-2"
                                        onClick={() => handleSetLabel(address)}
                                    >
                                        {address}
                                    </button>
                                    {/* {address !== 'All' && (
                                        <button
                                            className="hover:bg-slate-400  rounded-lg px-2 py-2"
                                            onClick={() =>
                                                handleDeleteAddress(address)
                                            }
                                        >
                                            Delete
                                        </button>
                                    )} */}
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="flex gap-4">
                        <input
                            className="block border rounded-md w-full px-5 py-1 border-black justify-between"
                            type="text"
                            value={formAddress}
                            onChange={(e) => setFormAddress(e.target.value)}
                            placeholder="0x00...0000"
                        />
                        <button
                            className="hover:bg-slate-400  rounded-lg px-4 py-2"
                            onClick={handleAddClick}
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
