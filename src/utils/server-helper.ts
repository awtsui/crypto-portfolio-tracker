import TokenFilter from '@/models/TokenFilter'
import { TokenFilter as TokenFilterInterface } from '@/types'

export async function filterTokenIds({ contracts }: { contracts: string[] }) {
    try {
        const tokenFilters: TokenFilterInterface[] = await TokenFilter.find({
            contractAddress: { $in: contracts },
        })
        let result: string[] = []

        tokenFilters.forEach((tokenFilter) => {
            if (
                result.indexOf(tokenFilter.contractAddress) === -1 ||
                !tokenFilter.existsOnEthereumL1
            ) {
                result.push(tokenFilter.contractAddress)
            }
        })
        return result
    } catch (error) {
        throw error
    }
}
