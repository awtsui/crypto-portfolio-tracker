/**
 * Fetching from Alchemy API is kept client side. Ran into problems trying to operate sdk server side.
 */

import { Alchemy, Network } from 'alchemy-sdk'

const config = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(config)

export function getAlchemy() {
    if (!alchemy) {
        throw new Error('Alchemy object failed to configure')
    }
    return alchemy
}
