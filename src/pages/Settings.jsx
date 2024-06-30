import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SettingsContent from '../components/SettingsContent'

export default function Settings() {

    useEffect(() => {
        window.scrollTo(0, 0);
    })

    return (
        <>
            <Header />
            <SettingsContent />
            <Footer />
        </>
    )
}