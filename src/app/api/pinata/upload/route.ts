/* eslint-disable @typescript-eslint/no-explicit-any */
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
        const walletAddress = (formData.get('walletAddress') as string) || '';

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Enforce authenticated wallet for this flow
        if (!walletAddress) {
            return NextResponse.json(
                { error: 'Wallet address is required. Please connect your wallet before uploading.' },
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
        let json: unknown;
        try {
            json = text ? JSON.parse(text) : {};
        } catch {
            json = { raw: text } as Record<string, unknown>;
        }
        type PinataResponse = { IpfsHash?: string; cid?: string; Hash?: string; error?: { message?: string }; message?: string } & Record<string, unknown>;
        const jsonObj = (json && typeof json === 'object') ? (json as PinataResponse) : {} as PinataResponse;

        if (!pinataResponse.ok) {
            console.error('Pinata API error:', pinataResponse.status, jsonObj);
            const message = jsonObj.error?.message || jsonObj.message || 'Pinata upload failed';
            return NextResponse.json(
                { error: message, statusCode: pinataResponse.status, details: jsonObj },
                { status: 500 }
            );
        }

        const ipfsHash = jsonObj.IpfsHash || jsonObj.cid || jsonObj.Hash;
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

        // Persist report metadata in Firebase via internal API (non-blocking error handling)
        let storeResult: { success: boolean; id?: string; error?: string } = { success: false };
        if (walletAddress) {
            try {
                const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                const reportPayload = {
                    walletAddress,
                    hash,
                    timestamp: new Date().toISOString(),
                    cid: ipfsHash,
                    ipfsUrl,
                    txHash: tx.hash,
                    blockNumber: receipt?.blockNumber ?? null,
                    network: { chainId: Number(network.chainId), name: network.name },
                };
                const storeRes = await fetch(`${origin}/api/reports/store`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(reportPayload),
                });
                if (storeRes.ok) {
                    const json = await storeRes.json();
                    storeResult = { success: true, id: json.id };
                } else {
                    const errJsonUnknown = await storeRes.json().catch(() => ({}));
                    const errMsg = (typeof errJsonUnknown === 'object' && errJsonUnknown && 'error' in errJsonUnknown)
                        ? String((errJsonUnknown as { error?: unknown }).error)
                        : 'Failed to store report';
                    storeResult = { success: false, error: errMsg };
                }
            } catch (persistErr: unknown) {
                console.error('Report persistence error:', persistErr);
                const msg = (typeof persistErr === 'object' && persistErr && 'message' in persistErr)
                    ? String((persistErr as { message?: unknown }).message)
                    : 'Persistence error';
                storeResult = { success: false, error: msg };
            }
        }

        return NextResponse.json({
            success: true,
            cid: ipfsHash,
            ipfsUrl,
            hash,
            txHash: tx.hash,
            blockNumber: receipt?.blockNumber ?? null,
            pinataUrl: `https://app.pinata.cloud/ipfs/${ipfsHash}`,
            network: { chainId: Number(network.chainId), name: network.name },
            store: storeResult,
        });
    } catch (error: unknown) {
        console.error('Pinata upload error details:', error);
        const message = error && typeof error === 'object' && 'message' in error ? (error as any).message : 'Failed to upload to Pinata';
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}