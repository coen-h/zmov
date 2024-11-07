import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <div className='flex justify-between items-center bg-gradient-to-t from-[#1a0b0b] px-12 pt-8 pb-5 max-md:px-4'>
        <div className='flex flex-col gap-[10px]'>
            <div className='flex text-lg font-bold gap-[3px]'><p>Welcome to</p>
                <img src="/images/logo.svg" className='w-[90px]' alt="Logo"/>
            </div>
            <div className='text-sm max-md:text-xs'><p>This site does not store any files on our server, we only link to the media which is hosted on 3rd party services.</p></div>
            <div className='text-sm'>Copyright © zmov 2024</div>
        </div>
        <div className='flex items-center ml-[10px] gap-6'>
            <Link to="/dmca" className='font-bold opacity-50 no-underline hover:opacity-100'>DMCA</Link>
            <a target="_blank" href="https://github.com/coen-h" rel="noopener noreferrer"><i className="fa-brands fa-github text-white text-[40px] opacity-50 hover:opacity-100" alt="Github Icon"></i></a>
        </div>
    </div>
    )
}