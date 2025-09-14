import { NextRequest, NextResponse } from 'next/server';
import { addUserReport, type ReportData } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const reportData = (await request.json()) as ReportData;

    if (!reportData?.walletAddress || !reportData?.hash || !reportData?.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress, hash, or timestamp' },
        { status: 400 }
      );
    }

    const result = await addUserReport(reportData);
    if (result.success) {
      return NextResponse.json({ success: true, id: result.id }, { status: 200 });
    }
    return NextResponse.json({ error: 'Failed to store report' }, { status: 500 });
  } catch (error: unknown) {
    console.error('Error storing report:', error);
    const message = (typeof error === 'object' && error && 'message' in error)
      ? String((error as { message?: unknown }).message)
      : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}