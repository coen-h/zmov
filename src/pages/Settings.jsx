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
            <div id="settings-page">
                <h1 id="settings-title">Welcome Back!</h1>
                <Watchlist />
            </div>
            <Footer />
        </>
    )
}