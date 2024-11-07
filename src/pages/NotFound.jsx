import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    useEffect(() => {
        document.title = `Not Found - zmov`;
    })
    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center'>
            <h1 className='text-[2rem] font-bold mb-4'>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" id="notfound-link" className='mt-4 text-2xl font-bold opacity-50 p-2 rounded-lg border border-solid border-white bg-white bg-opacity-10 transition-all duration-200 hover:opacity-100'>Home</Link>
        </div>
    );
}