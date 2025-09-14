/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

const GATEWAY = process.env.PINATA_GATEWAY || 'gateway.pinata.cloud';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const cid = searchParams.get('cid');
        const asUrl = searchParams.get('asUrl') === 'true'; // optional: return URL instead of content

        if (!cid) {
            return NextResponse.json({ error: 'Missing cid query param' }, { status: 400 });
        }

        // If you are using a private gateway with a custom subdomain set in PINATA_GATEWAY,
        // this URL will use it. For public content, the default gateway works.
        const fileUrl = `https://${GATEWAY}/ipfs/${cid}`;

        if (asUrl) {
            // Return a small JSON containing the direct URL
            return NextResponse.json({ url: fileUrl });
        }

        // Stream the file back to the client
        const res = await fetch(fileUrl, { method: 'GET' });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            return NextResponse.json(
                { error: 'Failed to fetch from gateway', status: res.status, details: text?.slice(0, 500) },
                { status: 502 }
            );
        }

        // Copy headers, but set Content-Disposition for download
        const headers = new Headers(res.headers);
        // Best effort filename
        const filename = `report-${cid}.pdf`;
        headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        // Some gateways set content-type; keep if present
        const contentType = headers.get('content-type') || 'application/pdf';
        headers.set('content-type', contentType);

        const body = res.body;
        if (!body) {
            return NextResponse.json({ error: 'Empty response body from gateway' }, { status: 502 });
        }
        return new Response(body, { status: 200, headers });
    } catch (err) {
        const message = (typeof err === 'object' && err && 'message' in err) ? String((err as any).message) : 'Download failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}