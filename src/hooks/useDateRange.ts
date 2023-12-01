import { TimePeriodToDays, DAY_IN_MILLI_SEC } from '@/constants'
import { TimePeriod } from '@/types'
import { convertEpochToDate } from '@/utils/client-helper'
import { useEffect, useState } from 'react'

export default function useDateRange() {
    const [dateArray, setDateArray] = useState<number[]>([])
    useEffect(() => {
        const rangeInDays = TimePeriodToDays[TimePeriod.ONE_YEAR]
        let currentDate =
            Math.ceil(Date.now() / DAY_IN_MILLI_SEC) * DAY_IN_MILLI_SEC -
            rangeInDays * DAY_IN_MILLI_SEC

        let newDateArray = []
        for (let i = 0; i < rangeInDays; i++) {
            currentDate += DAY_IN_MILLI_SEC
            newDateArray.push(currentDate)
        }
        setDateArray(newDateArray.slice(0, -1))
    }, [])
    return { dateArray }
}
