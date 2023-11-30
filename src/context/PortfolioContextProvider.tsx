'use client'
import { TransactionDataRecord } from '@/types'
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react'

interface PortfolioContext {
    addresses: string[]
    selectedAddress: string
    setSelectedAddress: Dispatch<SetStateAction<string>>
    addAddress: (address: string) => void
    removeAddress: (address: string) => void
    portfolioTransactions: TransactionDataRecord
    addPortfolioTransactions: (txns: TransactionDataRecord) => void
}

const PortfolioContext = createContext<PortfolioContext | null>(null)

export const usePortfolio = () => {
    const context = useContext(PortfolioContext)

    if (context === null) {
        throw new Error('usePortfolio must be used within PortfolioProvider')
    }
    return context
}

// function loadJSON(key: string) {
//     if (localStorage[key]) return JSON.parse(localStorage[key] ?? '')
//     return ''
// }
// function saveJSON(key: string, data: string[]) {
//     localStorage.setItem(key, JSON.stringify(data))
// }

interface PortfolioProviderProps {
    children?: React.ReactNode
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
    // const key = 'PORTFOLIO_ADDRESSES'
    // const firstRender = useRef(true)
    const [addresses, setAddresses] = useState<string[]>([
        '0x22356921393726deba67808dfbdc087f69473552',
    ])
    // For testing --> Large Example Wallet: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326'
    const [portfolioTransactions, setPortfolioTransactions] =
        useState<TransactionDataRecord>({})
    const [selectedAddress, setSelectedAddress] = useState<string>(addresses[0])

    // useEffect(() => {
    //     if (firstRender.current) {
    //         firstRender.current = false
    //         const localAddresses = loadJSON(key)
    //         localAddresses && setAddresses(localAddresses)
    //     }
    //     saveJSON(key, addresses)
    // }, [key, addresses])

    // TODO: Verify address
    const addAddress = useCallback((address: string) => {
        setAddresses((addresses) => addresses.concat(address))
    }, [])

    const removeAddress = useCallback((address: string) => {
        setAddresses((addresses) =>
            addresses.filter((value) => value !== address)
        )
    }, [])

    const addPortfolioTransactions = useCallback(
        (txns: TransactionDataRecord) => {
            setPortfolioTransactions(txns)
        },
        []
    )

    return (
        <PortfolioContext.Provider
            value={{
                addresses,
                selectedAddress,
                setSelectedAddress,
                addAddress,
                removeAddress,
                portfolioTransactions,
                addPortfolioTransactions,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}
