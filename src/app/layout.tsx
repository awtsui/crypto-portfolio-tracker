import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PortfolioProvider } from '../context/PortfolioContextProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Crypto Portfolio Tracker',
    description: 'By Alvin Tsui',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className=" bg-blue-100/50">
            <PortfolioProvider>
                <body className="min-h-screen">{children}</body>
            </PortfolioProvider>
        </html>
    )
}
