'use client';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import App from './grant';

export default function Home() {
  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      console.log('Farcaster Mini App is ready!');
    };
    init();
  }, []);

  return (
    <main className="">
      <App />
    </main>
  );
}
