// components/ConnectWalletButton.tsx (updated)
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/context/web3Context";

export function ConnectWalletButton() {
  const router = useRouter();
  const { wallet, connectWallet, disconnectWallet, isLoading } = useWeb3();

  if (wallet?.isConnected) {
    return (
      <div className="flex flex-row items-center gap-2">
        <p className="text-sm" onClick={() => router.push("/profile")}>
          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)} •{" "}
          {wallet.balance} ETH
        </p>
        <Button
          onClick={disconnectWallet}
          variant="outline"
          className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isLoading}
      className="border-2 border-border shadow-shadow hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
    >
      {isLoading ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
}
