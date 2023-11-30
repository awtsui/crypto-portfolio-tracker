import { Schema, model, models } from 'mongoose'
import { TokenFilter as ITokenFilter } from '@/types'

const TokenFilterSchema = new Schema<ITokenFilter>({
    contractAddress: {
        type: String,
        unique: true,
        required: true,
        dropDups: true,
    },
    existsOnEthereumL1: Boolean,
})

const TokenFilter =
    models.TokenFilter || model('TokenFilter', TokenFilterSchema)

export default TokenFilter
