// app/api/pinata/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { ethers } from 'ethers';
// import { useWeb3 } from '@/context/web3Context';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    // const { wallet } = useWeb3();
    try {
        // Debug: Check if environment variables are loaded
        console.log('PINATA_JWT exists:', !!process.env.PINATA_JWT);
        console.log('PINATA_API_KEY exists:', !!process.env.PINATA_API_KEY);
        console.log('PINATA_SECRET_API_KEY exists:', !!process.env.PINATA_SECRET_API_KEY);
        console.log('PINATA_GATEWAY:', process.env.PINATA_GATEWAY);

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Compute SHA-256 of file (this is what we'll store on-chain)
        const buffer = Buffer.from(await file.arrayBuffer());
        const hash = '0x' + crypto.createHash('sha256').update(buffer).digest('hex');

        // Choose auth method: prefer JWT, fallback to API key/secret
        const useJwt = !!process.env.PINATA_JWT;
        const useKeys = !!process.env.PINATA_API_KEY && !!process.env.PINATA_SECRET_API_KEY;
        if (!useJwt && !useKeys) {
            return NextResponse.json(
                { error: 'Pinata credentials not configured. Provide PINATA_JWT or PINATA_API_KEY + PINATA_SECRET_API_KEY.' },
                { status: 500 }
            );
        }

        // Build multipart form data for Pinata REST API
        const pinataFormData = new FormData();
        // Append the PDF content (use the buffer to ensure consistency with the hashed content)
        pinataFormData.append('file', new Blob([buffer]), file.name);

        // Optional metadata and options
        pinataFormData.append('pinataMetadata', JSON.stringify({
            name: file.name,
            keyvalues: { uploadedBy: 'seo-ai-app' }
        }));
        pinataFormData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        const headers: Record<string, string> = {};
        if (useJwt) {
            headers['Authorization'] = `Bearer ${process.env.PINATA_JWT}`;
        } else if (useKeys) {
            headers['pinata_api_key'] = process.env.PINATA_API_KEY as string;
            headers['pinata_secret_api_key'] = process.env.PINATA_SECRET_API_KEY as string;
        }

        const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers,
            body: pinataFormData,
        });

        // Try to parse JSON error/body safely
        const text = await pinataResponse.text();
        let json: any;
        try { json = text ? JSON.parse(text) : {}; } catch { json = { raw: text }; }

        if (!pinataResponse.ok) {
            console.error('Pinata API error:', pinataResponse.status, json);
            const message = json?.error?.message || json?.message || 'Pinata upload failed';
            return NextResponse.json(
                { error: message, statusCode: pinataResponse.status, details: json },
                { status: 500 }
            );
        }

        const ipfsHash = json.IpfsHash || json.cid || json.Hash;
        const gateway = process.env.PINATA_GATEWAY || 'gateway.pinata.cloud';
        const ipfsUrl = `https://${gateway}/ipfs/${ipfsHash}`;

        // Store the SHA-256 hash on Avalanche C-Chain
        if (!process.env.AVALANCHE_RPC_URL || !process.env.AVALANCHE_PRIVATE_KEY || !process.env.AVALANCHE_CONTRACT_ADDRESS) {
            return NextResponse.json(
                { error: 'Blockchain environment not configured: missing AVALANCHE_RPC_URL or AVALANCHE_PRIVATE_KEY or AVALANCHE_CONTRACT_ADDRESS', cid: ipfsHash, ipfsUrl },
                { status: 500 }
            );
        }

        // Minimal ABI for storeReport
        const ABI = [
            'function storeReport(string memory _reportHash) public',
        ];

        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
        const wallet = new ethers.Wallet(process.env.AVALANCHE_PRIVATE_KEY!, provider);

        // Trim and validate address
        const address = process.env.AVALANCHE_CONTRACT_ADDRESS!.trim();
        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            return NextResponse.json(
                { error: 'Invalid AVALANCHE_CONTRACT_ADDRESS format', details: { address } },
                { status: 500 }
            );
        }

        // Preflight: ensure contract code exists at address
        const [network, code] = await Promise.all([
            provider.getNetwork(),
            provider.getCode(address),
        ]);
        if (!code || code === '0x') {
            return NextResponse.json(
                { error: 'Contract not found at AVALANCHE_CONTRACT_ADDRESS on the configured network.', details: { address, chainId: Number(network.chainId) }, cid: ipfsHash, ipfsUrl },
                { status: 500 }
            );
        }

        const contract = new ethers.Contract(address, ABI, wallet);

        const tx = await contract.storeReport(hash);
        const receipt = await tx.wait();

        return NextResponse.json({
            success: true,
            cid: ipfsHash,
            ipfsUrl,
            hash,
            txHash: tx.hash,
            blockNumber: receipt?.blockNumber ?? null,
            pinataUrl: `https://app.pinata.cloud/ipfs/${ipfsHash}`,
            network: { chainId: Number(network.chainId), name: network.name },
        });
    } catch (error: any) {
        console.error('Pinata upload error details:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to upload to Pinata' },
            { status: 500 }
        );
    }
}