/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Smart contract ABI
const ABI = [
    "function storeReport(string memory _reportHash) public",
    "function verifyReport(string memory _reportHash) public view returns (uint256)",
    "event ReportStored(string indexed reportHash, uint256 timestamp)"
];

export async function POST(req: NextRequest) {
    try {
        const { reportHash } = await req.json();

        if (!reportHash) {
            return NextResponse.json(
                { error: "Report hash is required" },
                { status: 400 }
            );
        }

        // Initialize provider and wallet
        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
        const wallet = new ethers.Wallet(process.env.AVALANCHE_PRIVATE_KEY!, provider);

        // Create contract instance
        const contract = new ethers.Contract(
            process.env.AVALANCHE_CONTRACT_ADDRESS!,
            ABI,
            wallet
        );

        // Call the contract
        const tx = await contract.storeReport(reportHash);
        await tx.wait(); // Wait for confirmation

        return NextResponse.json({
            success: true,
            txHash: tx.hash
        });
    } catch (err: any) {
        console.error("Store report error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Failed to store report" },
            { status: 500 }
        );
    }
}