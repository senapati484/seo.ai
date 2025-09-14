// pages/api/user/reports.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserReports } from '@/lib/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { walletAddress } = req.query;

    if (!walletAddress || typeof walletAddress !== 'string') {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    try {
        const result = await getUserReports(walletAddress);

        if (result.success) {
            return res.status(200).json({ reports: result.reports });
        } else {
            return res.status(500).json({ error: 'Failed to fetch reports' });
        }
    } catch (error) {
        console.error('Error fetching reports:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}