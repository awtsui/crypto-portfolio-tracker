import { Schema, model, models } from 'mongoose'
import { TokenInfo as ITokenInfo } from '@/types'

const TokenInfoSchema = new Schema<ITokenInfo>(
    {
        tokenId: { type: String, unique: true, required: true, dropDups: true },
        contractAddress: {
            type: String,
            unique: true,
            required: true,
            dropDups: true,
        },
        symbol: String,
    },
    { timestamps: true }
)

const TokenInfo = models.TokenInfo || model('TokenInfo', TokenInfoSchema)

export default TokenInfo
