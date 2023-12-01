/**
 * Accessing CoinGecko's public APIs
 */

import { CoinGeckoClient } from 'coingecko-api-v3'

const client = new CoinGeckoClient({
    timeout: 10000,
    autoRetry: true,
})

export function getGeckoClient() {
    if (!client) {
        throw new Error('Gecko client no instantiated')
    }
    return client
}
