import { NextRequest, NextResponse } from 'next/server';
import { getUserReports } from '@/lib/firebase';

export async function GET(
  _request: NextRequest,
  { params }: { params: { walletAddress: string } }
) {
  try {
    const { walletAddress } = params;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    const result = await getUserReports(walletAddress);
    if (result.success) {
      return NextResponse.json({ success: true, reports: result.reports }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to retrieve reports' }, { status: 500 });
  } catch (error: unknown) {
    console.error('Error retrieving reports:', error);
    const message = error && typeof error === 'object' && 'message' in error ? (error as { message?: string }).message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}