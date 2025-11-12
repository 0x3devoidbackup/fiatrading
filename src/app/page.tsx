'use client';
import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import App from './grant';

export default function Home() {
  useEffect(() => {
    const init = async () => {
      await sdk.actions.ready();
      await sdk.wallet.getEthereumProvider();
    };
    init();
  }, []);

  return (
    <main className="">
      <App />
    </main>
  );
}
