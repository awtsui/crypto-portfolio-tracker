import { TimePeriodToDays } from '@/constants'
import { TimePeriod } from '@/types'
import { convertEpochToDate } from '@/utils/client-helper'
import { ChartData } from 'chart.js'
import { useEffect, useState } from 'react'

type useChartDataProps = {
    historicalValueArray: number[]
    selectedTimePeriod: TimePeriod
    dateArray: number[]
}

export default function useChartData({
    historicalValueArray,
    selectedTimePeriod,
    dateArray,
}: useChartDataProps) {
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: ['1'],
        datasets: [
            {
                data: [1],
            },
        ],
    })
    useEffect(() => {
        if (historicalValueArray.length && dateArray.length) {
            setChartData({
                ...chartData,
                labels: dateArray
                    .slice(-TimePeriodToDays[selectedTimePeriod])
                    .map((date) =>
                        convertEpochToDate({ date, includeYear: false })
                    ),
                datasets: [
                    {
                        label: '',
                        data: historicalValueArray.slice(
                            -TimePeriodToDays[selectedTimePeriod]
                        ),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgb(53, 162, 235, 0.4)',
                    },
                ],
            })
        }
    }, [JSON.stringify(historicalValueArray), selectedTimePeriod, dateArray])

    return { chartData }
}
