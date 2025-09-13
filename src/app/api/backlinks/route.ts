import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Simulate backlink analysis data
    // In a real implementation, this would connect to Ahrefs, Majestic, or SEMrush API
    const backlinkData = {
      totalBacklinks: Math.floor(Math.random() * 10000) + 1000,
      referringDomains: Math.floor(Math.random() * 500) + 100,
      domainAuthority: Math.floor(Math.random() * 50) + 30,
      pageAuthority: Math.floor(Math.random() * 50) + 25,
      spamScore: Math.floor(Math.random() * 10) + 1,
      backlinkGrowth: {
        last30Days: Math.floor(Math.random() * 100) + 20,
        last90Days: Math.floor(Math.random() * 300) + 50,
        trend: "increasing", // or "decreasing", "stable"
      },
      lostBacklinks: {
        last30Days: Math.floor(Math.random() * 50) + 5,
        last90Days: Math.floor(Math.random() * 150) + 20,
      },
      topAnchorTexts: [
        { text: "professional networking", count: 150, percentage: 15 },
        { text: "linkedin", count: 120, percentage: 12 },
        { text: "job search", count: 95, percentage: 9.5 },
        { text: "career development", count: 80, percentage: 8 },
        { text: "business networking", count: 65, percentage: 6.5 },
        { text: "professional profile", count: 55, percentage: 5.5 },
        { text: "click here", count: 45, percentage: 4.5 },
        { text: "read more", count: 40, percentage: 4 },
        { text: "website", count: 35, percentage: 3.5 },
        { text: "homepage", count: 30, percentage: 3 },
      ],
      backlinkTypes: {
        dofollow: Math.floor(Math.random() * 8000) + 800,
        nofollow: Math.floor(Math.random() * 2000) + 200,
        ugc: Math.floor(Math.random() * 500) + 50,
        sponsored: Math.floor(Math.random() * 300) + 30,
      },
      topReferringDomains: [
        {
          domain: "forbes.com",
          authority: 92,
          backlinks: 25,
          type: "dofollow",
        },
        {
          domain: "techcrunch.com",
          authority: 89,
          backlinks: 18,
          type: "dofollow",
        },
        {
          domain: "businessinsider.com",
          authority: 87,
          backlinks: 15,
          type: "dofollow",
        },
        {
          domain: "entrepreneur.com",
          authority: 85,
          backlinks: 12,
          type: "dofollow",
        },
        { domain: "inc.com", authority: 83, backlinks: 10, type: "dofollow" },
        {
          domain: "medium.com",
          authority: 78,
          backlinks: 35,
          type: "dofollow",
        },
        {
          domain: "wordpress.com",
          authority: 75,
          backlinks: 28,
          type: "dofollow",
        },
        {
          domain: "blogspot.com",
          authority: 72,
          backlinks: 22,
          type: "dofollow",
        },
        {
          domain: "tumblr.com",
          authority: 68,
          backlinks: 18,
          type: "dofollow",
        },
        {
          domain: "reddit.com",
          authority: 90,
          backlinks: 45,
          type: "nofollow",
        },
      ],
      backlinkQuality: {
        high: Math.floor(Math.random() * 3000) + 500,
        medium: Math.floor(Math.random() * 4000) + 800,
        low: Math.floor(Math.random() * 3000) + 700,
      },
      geographicDistribution: [
        { country: "United States", percentage: 45 },
        { country: "United Kingdom", percentage: 15 },
        { country: "Canada", percentage: 10 },
        { country: "Australia", percentage: 8 },
        { country: "Germany", percentage: 7 },
        { country: "France", percentage: 5 },
        { country: "India", percentage: 4 },
        { country: "Others", percentage: 6 },
      ],
      backlinkVelocity: {
        daily: Math.floor(Math.random() * 10) + 2,
        weekly: Math.floor(Math.random() * 50) + 15,
        monthly: Math.floor(Math.random() * 200) + 50,
      },
    };

    // Calculate percentages for backlink types
    const totalBacklinks = backlinkData.totalBacklinks;
    backlinkData.backlinkTypes.dofollowPercent = Math.round(
      (backlinkData.backlinkTypes.dofollow / totalBacklinks) * 100
    );
    backlinkData.backlinkTypes.nofollowPercent = Math.round(
      (backlinkData.backlinkTypes.nofollow / totalBacklinks) * 100
    );
    backlinkData.backlinkTypes.ugcPercent = Math.round(
      (backlinkData.backlinkTypes.ugc / totalBacklinks) * 100
    );
    backlinkData.backlinkTypes.sponsoredPercent = Math.round(
      (backlinkData.backlinkTypes.sponsored / totalBacklinks) * 100
    );

    // Calculate quality percentages
    const totalQuality =
      backlinkData.backlinkQuality.high +
      backlinkData.backlinkQuality.medium +
      backlinkData.backlinkQuality.low;
    backlinkData.backlinkQuality.highPercent = Math.round(
      (backlinkData.backlinkQuality.high / totalQuality) * 100
    );
    backlinkData.backlinkQuality.mediumPercent = Math.round(
      (backlinkData.backlinkQuality.medium / totalQuality) * 100
    );
    backlinkData.backlinkQuality.lowPercent = Math.round(
      (backlinkData.backlinkQuality.low / totalQuality) * 100
    );

    return NextResponse.json(backlinkData);
  } catch (error) {
    console.error("Backlink analysis error:", error);
    return NextResponse.json(
      {
        error: `Backlink analysis failed: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
