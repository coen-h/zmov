'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import WatchCard, { WatchCardData } from '@/app/components/WatchCard';
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type WatchItem = WatchCardData & {
  id: number;
  itemId: string;
  type: string;
  createdAt: string;
}

export default function Home() {
  const [watchedItems, setWatchedItems] = useState<WatchItem[]>([])
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setUser(data.session.user);
        fetchWatchedItems(data.session.user.id);
      } else {
        router.push('/login')
        setUser(null);
        setWatchedItems([]);
      }
    });
  }, []);

  const fetchWatchedItems = async (userId: string) => {
    const { data, error } = await supabase
      .from('watchedItem')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching watched items:', error);
    } else {
      setWatchedItems(data);
    }
  };

  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    router.push('/')
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const clearWatched = async () => {
    if (!user) return;
    setWatchedItems([]);

    const { error } = await supabase
      .from('watchedItem')
      .delete()
      .eq('userId', user.id);

    if (error) {
      console.error('Error clearing watched items:', error);
    }
  };

  const removeWatchItem = async (itemId: number, type: string) => {
    if (!user) return;

    setWatchedItems((prev) =>
      prev.filter((t) => !(t.itemId === itemId && t.type === type))
    );

    const { error } = await supabase
      .from('watchedItem')
      .delete()
      .eq('userId', user.id)
      .eq('itemId', itemId)
      .eq('type', type);

    if (error) {
      console.error('Error removing watch item:', error);
    }
  };

  return (
    <>
      <Header />
      <div className='flex flex-col items-center min-h-screen p-4 pt-16 max-lg:p-2 max-lg:pt-16 bg-[radial-gradient(circle_at_top,_#382222_0%,_transparent_70%)]'>
        <h1 className='text-5xl text-center font-semibold my-6 w-full max-w-[1600px] max-xs:text-4xl'>Welcome Back{user ? ' ' + user?.user_metadata?.name : ''}!</h1>
        <div className="relative border border-white/20 w-full flex flex-col gap-2 bg-white/10 rounded-xl p-2 max-w-[1600px] max-sm:p-1">
          
          <div className='absolute z-40 top-0 right-0 p-1 gap-2 flex bg-neutral-900/25 backdrop-blur-sm rounded-tr-xl rounded-bl-xl'>
            <button className="bg-neutral-50/20 hover:bg-neutral-50/10 px-2 h-8 rounded-lg cursor-pointer" onClick={signOutUser}>Sign Out</button>
            <button className="bg-red-600/40 hover:bg-red-600/20 px-2 h-8 rounded-lg cursor-pointer" onClick={clearWatched}>Clear</button>
          </div>
          
          <div className='grid gap-2 items-center justify-center grid-cols-4 max-4xl:grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1'>
            {watchedItems.length === 0 ? (
              <div className='flex items-center justify-center min-h-70 col-span-full'>
                <p className="text-white/70">No items to continue watching.</p>
              </div>
            ) : ( watchedItems.map((item) => (
              <WatchCard key={`${item.itemId}-${item.type}`} data={item} onRemove={() => removeWatchItem(item.itemId, item.type)}/>
            )))}
          </div>
        </div>
        
      </div>
      <Footer />
    </>
  );
}