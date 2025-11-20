'use client';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('./fiatapp'), { ssr: false });

export default function Home() {
  
  return (
    <main className="">
      <App />
    </main>
  );
}
