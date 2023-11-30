import { Schema, model, models } from 'mongoose'
import { TokenMarketData as ITokenMarketData } from '@/types'

const TokenMarketDataSchema = new Schema<ITokenMarketData>({
    tokenId: { type: String, unique: true, required: true, dropDups: true },
    data: {
        dates: [Number],
        prices: [Number],
    },
})

const TokenMarketData =
    models.TokenMarketData || model('TokenMarketData', TokenMarketDataSchema)

export default TokenMarketData
