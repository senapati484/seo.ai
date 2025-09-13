// context/Web3Context.tsx (updated)
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Wallet, Web3WalletSchema } from "@/schemas/web3";

interface Web3ContextType {
  wallet: Web3Wallet | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Web3Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load wallet data from localStorage on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem("web3Wallet");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet);
        const validatedWallet = Web3WalletSchema.parse(parsedWallet);
        setWallet(validatedWallet);
      } catch (error) {
        console.error("Failed to parse stored wallet data:", error);
        localStorage.removeItem("web3Wallet");
      }
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask!");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);

      const walletData: Web3Wallet = {
        address,
        balance: parseFloat(balanceEth).toFixed(4),
        isConnected: true,
      };

      // Validate with Zod
      const validatedWallet = Web3WalletSchema.parse(walletData);

      setWallet(validatedWallet);
      localStorage.setItem("web3Wallet", JSON.stringify(validatedWallet));
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet.");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem("web3Wallet");
  };

  return (
    <Web3Context.Provider
      value={{ wallet, connectWallet, disconnectWallet, isLoading }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
