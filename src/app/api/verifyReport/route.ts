// app/api/verifyReport/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import crypto from 'crypto';

export const runtime = 'nodejs';

// Smart contract ABI
const ABI = [
    "function verifyReport(string memory _reportHash) public view returns (uint256)",
    "event ReportStored(string indexed reportHash, uint256 timestamp)"
];

// Helper function to validate address
function isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET() {
    try {
        // Check environment variables
        if (!process.env.AVALANCHE_RPC_URL) {
            return NextResponse.json(
                { error: 'Missing AVALANCHE_RPC_URL' },
                { status: 500 }
            );
        }

        if (!process.env.AVALANCHE_CONTRACT_ADDRESS) {
            return NextResponse.json(
                { error: 'Missing AVALANCHE_CONTRACT_ADDRESS' },
                { status: 500 }
            );
        }

        const address = process.env.AVALANCHE_CONTRACT_ADDRESS.trim();

        if (!isValidAddress(address)) {
            return NextResponse.json(
                { error: 'Invalid contract address format' },
                { status: 500 }
            );
        }

        // Initialize provider
        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);

        // Get network info
        const network = await provider.getNetwork();

        // Check contract code
        const code = await provider.getCode(address);
        const hasCode = code && code !== '0x';

        return NextResponse.json({
            configured: true,
            address,
            network: {
                chainId: Number(network.chainId),
                name: network.name,
                chainIdHex: network.chainId.toString()
            },
            contract: {
                exists: hasCode,
                codeSize: code.length
            },
            rpc: process.env.AVALANCHE_RPC_URL
        });
    } catch (err: any) {
        console.error('Diagnostics error:', err);
        return NextResponse.json(
            { error: 'Diagnostics failed', details: err.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.AVALANCHE_RPC_URL) {
            return NextResponse.json(
                { error: 'Missing AVALANCHE_RPC_URL' },
                { status: 500 }
            );
        }

        if (!process.env.AVALANCHE_CONTRACT_ADDRESS) {
            return NextResponse.json(
                { error: 'Missing AVALANCHE_CONTRACT_ADDRESS' },
                { status: 500 }
            );
        }

        const address = process.env.AVALANCHE_CONTRACT_ADDRESS.trim();

        if (!isValidAddress(address)) {
            return NextResponse.json(
                { error: 'Invalid contract address format' },
                { status: 500 }
            );
        }

        // Get file from request
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'PDF file is required' },
                { status: 400 }
            );
        }

        // Compute file hash
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = '0x' + crypto.createHash('sha256').update(buffer).digest('hex');

        // Initialize provider and check contract
        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
        const code = await provider.getCode(address);

        if (!code || code === '0x') {
            const network = await provider.getNetwork();

            return NextResponse.json(
                {
                    error: 'Contract not found',
                    details: {
                        address,
                        chainId: Number(network.chainId),
                        networkName: network.name,
                        rpcUrl: process.env.AVALANCHE_RPC_URL
                    },
                    suggestions: [
                        'Check if the contract is deployed to the correct network',
                        'Verify the contract address is correct',
                        'Ensure the RPC URL points to the correct network'
                    ]
                },
                { status: 500 }
            );
        }

        // Create contract instance
        const contract = new ethers.Contract(address, ABI, provider);

        // Call verifyReport
        const timestamp = await contract.verifyReport(hash);

        if (timestamp.toString() === '0') {
            return NextResponse.json({
                valid: false,
                message: 'Report not found on blockchain',
                hash
            });
        }

        return NextResponse.json({
            valid: true,
            timestamp: Number(timestamp),
            hash,
            network: await provider.getNetwork()
        });
    } catch (err: any) {
        console.error('Verification error:', err);

        return NextResponse.json(
            {
                error: 'Verification failed',
                details: err.message,
                ...(err.reason && { reason: err.reason }),
                ...(err.code && { code: err.code })
            },
            { status: 500 }
        );
    }
}