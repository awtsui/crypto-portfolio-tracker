'use client'
import { SALT_ITERATIONS } from '@/constants'
import { TransactionDataRecord } from '@/types'
import { shortenPortfolioAddress } from '@/utils/client-helper'
import { hashSync } from 'bcrypt-ts/browser'
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react'

interface PortfolioContext {
    portfolioAddresses: string[]
    selectedAddress: string
    setSelectedAddress: Dispatch<SetStateAction<string>>
    addPortfolioAddress: (address: string) => void
    removePortfolioAddress: (address: string) => void
    portfolioTransactions: TransactionDataRecord
    addPortfolioTransactions: (txns: TransactionDataRecord) => void
    addressDirectory: Record<string, string>
    hashPortfolioAddress: (address: string) => void
}

const PortfolioContext = createContext<PortfolioContext | null>(null)

export const usePortfolio = () => {
    const context = useContext(PortfolioContext)

    if (context === null) {
        throw new Error('usePortfolio must be used within PortfolioProvider')
    }
    return context
}

interface PortfolioProviderProps {
    children?: React.ReactNode
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
    const [portfolioAddresses, setPortfolioAddresses] = useState<string[]>([])
    const [addressDirectory, setAddressDirectory] = useState<
        Record<string, string>
    >({})

    const [portfolioTransactions, setPortfolioTransactions] =
        useState<TransactionDataRecord>({})
    const [selectedAddress, setSelectedAddress] = useState<string>('')

    const addPortfolioAddress = useCallback((address: string) => {
        setPortfolioAddresses((prev) =>
            prev.concat(shortenPortfolioAddress(address))
        )
        setAddressDirectory((prev) => ({
            ...prev,
            [shortenPortfolioAddress(address)]: address,
        }))
    }, [])

    const removePortfolioAddress = useCallback((address: string) => {
        setPortfolioAddresses((prev) =>
            prev.filter((value) => value !== address)
        )
    }, [])

    const addPortfolioTransactions = useCallback(
        (txns: TransactionDataRecord) => {
            setPortfolioTransactions(txns)
        },
        []
    )

    const hashPortfolioAddress = useCallback(
        (address: string) => {
            setAddressDirectory((prev) => ({
                ...prev,
                [address]: hashSync(addressDirectory[address], SALT_ITERATIONS),
            }))
        },
        [Object.keys(addressDirectory).length]
    )

    return (
        <PortfolioContext.Provider
            value={{
                portfolioAddresses,
                selectedAddress,
                setSelectedAddress,
                addPortfolioAddress,
                removePortfolioAddress,
                portfolioTransactions,
                addPortfolioTransactions,
                addressDirectory,
                hashPortfolioAddress,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}
