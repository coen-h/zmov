import { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Watchlist from '../components/Watchlist'

export default function Settings() {
    useEffect(() => {
        document.title = `Settings - zmov`;
        window.scrollTo(0, 0);
    })

    return (
        <>
            <Header />
            <div id="settings-page" className='flex flex-col pt-[8vh] min-h-screen z-[2] bg-[radial-gradient(circle at top, #382222 0%, transparent 70%)]'>
                <h1 id="settings-title" className='text-5xl text-center font-semibold my-8'>Welcome Back!</h1>
                <Watchlist />
            </div>
            <Footer />
        </>
    )
}