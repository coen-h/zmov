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
            <div id="settings-page" className='flex flex-col pt-[8vh] min-h-screen z-[2] bg-[radial-gradient(circle_at_top,_#382222_0%,_transparent_70%)] [@media(max-height:500px)]:pt-[10vh]'>
                <h1 id="settings-title" className='text-5xl text-center font-semibold my-8 max-sm:text-[12vw] max-md:mb-[5vw] max-md:mt-[7.5vw]'>Welcome Back!</h1>
                <Watchlist />
            </div>
            <Footer />
        </>
    )
}