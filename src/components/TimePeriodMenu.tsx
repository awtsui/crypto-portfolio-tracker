'use client'

import { TimePeriod } from '@/types'
import { Dispatch, SetStateAction, useState } from 'react'

type TimePeriodMenuProps = {
    selectedTimePeriod: TimePeriod
    setSelectedTimePeriod: Dispatch<SetStateAction<TimePeriod>>
}

export function TimePeriodMenu({
    selectedTimePeriod,
    setSelectedTimePeriod,
}: TimePeriodMenuProps) {
    const handleTimePeriodChange = (timePeriod: TimePeriod) => {
        setSelectedTimePeriod(timePeriod)
    }

    return (
        <div>
            <button
                className={`px-5 py-2 m-2 border-2 border-black ${
                    selectedTimePeriod === '1Y'
                        ? 'bg-blue-500 border-opacity-0 text-white'
                        : 'bg-white border-opacity-10 text-slate-600'
                } hover:bg-blue-700 hover:text-white active:bg-blue-800 rounded`}
                onClick={() => handleTimePeriodChange(TimePeriod.ONE_YEAR)}
            >
                1Y
            </button>
            <button
                className={`px-5 py-2 m-2 border-2 border-black ${
                    selectedTimePeriod === '6M'
                        ? 'bg-blue-500 border-opacity-0 text-white'
                        : 'bg-white border-opacity-10 text-slate-600'
                } hover:bg-blue-700 hover:text-white active:bg-blue-800 rounded`}
                onClick={() => handleTimePeriodChange(TimePeriod.SIX_MONTH)}
            >
                6M
            </button>
            <button
                className={`px-5 py-2 m-2 border-black border-2 ${
                    selectedTimePeriod === '1M'
                        ? 'bg-blue-500 border-opacity-0 text-white'
                        : 'bg-white border-opacity-10 text-slate-600'
                } hover:bg-blue-700 hover:text-white active:bg-blue-800 rounded`}
                onClick={() => handleTimePeriodChange(TimePeriod.ONE_MONTH)}
            >
                1M
            </button>
        </div>
    )
}
