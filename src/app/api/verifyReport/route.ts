/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import crypto from 'crypto';
export const runtime = 'nodejs';

// Smart contract ABI
const ABI = [
    "function verifyReport(string memory _reportHash) public view returns (uint256)"
];

export async function POST(req: NextRequest) {
    try {
        // Validate env vars
        if (!process.env.AVALANCHE_RPC_URL || !process.env.AVALANCHE_CONTRACT_ADDRESS) {
            return NextResponse.json(
                { error: 'Blockchain environment not configured: missing AVALANCHE_RPC_URL or AVALANCHE_CONTRACT_ADDRESS' },
                { status: 500 }
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: "PDF file is required" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Compute SHA-256 hash
        const hash = "0x" + crypto.createHash("sha256").update(buffer).digest("hex");

        // Initialize provider
        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);

        // Create contract instance
        const contract = new ethers.Contract(
            process.env.AVALANCHE_CONTRACT_ADDRESS!,
            ABI,
            provider
        );

        // Check if report exists on blockchain
        const timestamp = await contract.verifyReport(hash);

        if (timestamp.toString() === "0") {
            return NextResponse.json({
                valid: false,
                message: "Report not found on blockchain"
            });
        }

        return NextResponse.json({
            valid: true,
            timestamp: Number(timestamp),
            hash: hash
        });
    } catch (err: any) {
        console.error("Verify report error:", err);
        return NextResponse.json(
            { error: err.message || "Verification failed" },
            { status: 500 }
        );
    }
}