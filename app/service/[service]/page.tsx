'use client';

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Card, { CardData } from '@/app/components/Card';
import fetchService from '@/app/lib/fetchService';
import { serviceConfig } from "@/app/lib/serviceConfig";

type ServiceResponse = {
  results: CardData[];
  total_pages: number;
};

export default function Service() {
  const [serviceData, setServiceData] = useState<ServiceResponse>({ results: [], total_pages: 1 });
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const params = useParams<{ service: string }>();
  const service = Number(params.service);
  const config = serviceConfig.find(item => item.id === service);
  
  useEffect(() => {
      async function fetchData() {
        setServiceData({ results: [], total_pages: 1 });
        const result = await fetchService(service, page);
        console.log(result)
        setServiceData(result);
        setTotalPage(result.total_pages);
        window.scrollTo({top: 0, behavior: "smooth"});
      }
  
      fetchData();
  }, [service, page]);

  return (
    <>
      <Header />
      <div className={`flex flex-col items-center gap-8 pb-4 pt-20 max-lg:pt-[70px] max-2xl:pt-[84px] px-5 max-lg:px-3 min-h-screen ${config?.serviceBackground}`}>

        <p className='text-5xl'>{config?.name}</p>

        <div className='w-full max-w-[1200px] grid grid-cols-4 gap-5 max-xl:grid-cols-3 max-sm:grid-cols-2 max-xs:gap-3'>
          {serviceData.results?.map(item => (
            <Card key={item.id} data={item} />
          ))}
        </div>

        <div className="flex justify-center items-center">
          <button className={`p-2 bg-white/30 rounded-l-lg ${page <= 1 ? 'opacity-50' : 'cursor-pointer'}`} disabled={page <= 1} onClick={() => setPage(1)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='24px' height='24px' fill="#ffffff"><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm352-160l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L301.3 256 438.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0z"/></svg>
          </button>
          <button className={`p-2 bg-white/30 ${page <= 1 ? 'opacity-50' : 'cursor-pointer'}`} disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width='24px' height='24px' fill="#ffffff"><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
          </button>
          <p className={`py-2 px-3 bg-white/30 `}>{page}</p>
          <button className={`p-2 bg-white/30 cursor-pointer ${page >= totalPage ? 'opacity-50' : 'cursor-pointer'}`} disabled={page >= totalPage} onClick={() => setPage(page + 1)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width='24px' height='24px' fill="#ffffff"><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
          </button>
          <button className={`p-2 bg-white/30 rounded-r-lg cursor-pointer ${page >= totalPage ? 'opacity-50' : 'cursor-pointer'}`} disabled={page >= totalPage} onClick={() => setPage(totalPage)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='24px' height='24px' fill="#ffffff"><path d="M470.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 256 265.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160zm-352 160l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"/></svg>
          </button>
        </div>
        
      </div>
      <Footer />
    </>
  );
}