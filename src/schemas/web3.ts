// lib/schemas/web3.ts
import { z } from "zod";

export const Web3WalletSchema = z.object({
    address: z.string(),
    balance: z.string(),
    isConnected: z.boolean(),
});

export type Web3Wallet = z.infer<typeof Web3WalletSchema>;