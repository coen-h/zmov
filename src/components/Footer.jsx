import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div id="footer" className='flex justify-between items-center bg-gradient-to-t from-orange-950 px-12 pt-8 pb-5'>
        <div id="footer-left" className='flex flex-col gap-[10px]'>
            <div className='flex text-lg font-bold gap-[3px]'><p>Welcome to</p>
                <div id="footer-logo"><img src="/images/logo.svg" style={{width: "90px"}} alt="Logo"/></div>
            </div>
            <div style={{fontSize: "0.875rem"}}><p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p></div>
            <div style={{fontSize: "0.875rem"}}>Copyright © zmov 2024</div>
        </div>
        <div id="footer-right" className='flex items-center ml-[10px] gap-6'>
            <Link to="/dmca" id="dmca" className='font-bold opacity-50 no-underline hover:opacity-100'>DMCA</Link>
            <a target="_blank" href="https://github.com/coen-h" rel="noopener noreferrer"><i className="fa-brands fa-github text-white text-[40px] opacity-50 hover:opacity-100" id="github" alt="Github Icon"></i></a>
        </div>
    </div>
    )
}