import React from 'react'
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div id="footer">
        <div id="footer-left">
            <div id="welcome"><p>Welcome to</p>
                <div id="footer-logo"><img src="/images/logo.svg" style={{width: "90px"}} alt="Logo"/></div>
            </div>
            <div id="message"><p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p></div>
            <div id="copyright">Copyright © zmov 2024</div>
        </div>
        <div id="footer-right">
            <Link to="/dmca" id="dmca">DMCA</Link>
            <a target="_blank" href="mailto:me@coen.ovh" rel="noopener noreferrer"><img src="/images/email.svg" id="mail" alt="Email Icon"/></a>
            <a target="_blank" href="https://github.com/coen-h" rel="noopener noreferrer"><img src="/images/github-mark-white.svg" id="github" alt="Github Icon"/></a>
        </div>
    </div>
    )
}