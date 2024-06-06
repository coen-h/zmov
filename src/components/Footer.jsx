import React from 'react'

export default function Footer() {
    return (
        <div id="footer">
        <div id="footer-left">
            <div id="welcome"><p>Welcome to</p>
                <div id="footer-logo"><img src="./media/logo.png" style="width: 100px"></img></div>
            </div>
            <div id="message"><p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p></div>
            <div id="copyright">Copyright © zmov 2024</div>
        </div>
        <div id="footer-right">
            <a href="./pages/dmca.html" id="dmca">DMCA</a>
            <a target="_blank" href="mailto:me@coen.ovh" rel="noopener noreferrer"><img src="./media/email.png" id="mail"></img></a>
            <a target="_blank" href="https://github.com/coen-h" rel="noopener noreferrer"><img src="./media/github-mark-white.png" id="github"></img></a>
        </div>
    </div>
    )
}