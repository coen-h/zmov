import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div id="footer">
        <div id="footer-left">
            <div style={{display: "flex", fontSize: "1.1rem", fontWeight: "bold", gap: "3px"}}><p>Welcome to</p>
                <div id="footer-logo"><img src="/images/logo.svg" style={{width: "90px"}} alt="Logo"/></div>
            </div>
            <div style={{fontSize: "0.875rem"}}><p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p></div>
            <div style={{fontSize: "0.875rem"}}>Copyright © zmov 2024</div>
        </div>
        <div id="footer-right">
            <Link to="/dmca" id="dmca">DMCA</Link>
            <a target="_blank" href="https://github.com/coen-h" rel="noopener noreferrer"><i className="fa-brands fa-github" style={{color: "#ffffff"}} id="github" alt="Github Icon"></i></a>
        </div>
    </div>
    )
}