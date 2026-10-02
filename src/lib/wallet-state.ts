"use client";

import * as React from "react";

export interface WalletState {
  address: string;
  piBalance: number;
  handle: string;
  connectedAt: number;
}

const STORAGE_KEY = "kinyanjui-pi-wallet";
const EVENT = "kinyanjui-pi-wallet-change";

function read(): WalletState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WalletState) : null;
  } catch {
    return null;
  }
}

/**
 * A lightweight hook that subscribes to the wallet state stored by
 * WalletConnect. Any component can call this to read the connected wallet
 * (address, balance, handle) and react to connect/disconnect events.
 */
export function useWalletState() {
  const [wallet, setWallet] = React.useState<WalletState | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setWallet(read());
    const handler = () => setWallet(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  return { wallet, mounted };
}

/** Helper for WalletConnect to broadcast a change so subscribers update. */
export function broadcastWalletChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}
