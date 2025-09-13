import axios from "axios";
import { NextResponse } from "next/server";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "No Google PageSpeed API key found in environment variables",
      apiKeyPresent: false,
    });
  }

  try {
    // Test with a simple URL
    const testUrl = "https://www.google.com";
    const categories = [
      "performance",
      "seo",
      "accessibility",
      "best-practices",
    ];
    const results = {};

    console.log("Testing API key with categories:", categories);

    for (const category of categories) {
      try {
        console.log(`Testing ${category} category...`);
        const response = await axios.get(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
          {
            params: {
              url: testUrl,
              key: apiKey,
              strategy: "mobile",
              category: [category],
            },
            timeout: 10000,
          }
        );

        const { lighthouseResult } = response.data;

        if (lighthouseResult && lighthouseResult.categories) {
          results[category] = {
            score: lighthouseResult.categories[category]?.score,
            available: Object.keys(lighthouseResult.categories),
            audits: Object.keys(lighthouseResult.audits || {}).length,
          };
          console.log(`${category} category test successful`);
        } else {
          results[category] = {
            score: null,
            available: [],
            audits: 0,
            error: "No lighthouse data received",
          };
          console.log(`${category} category test failed - no data`);
        }

        // Add a small delay between requests
        await delay(500);
      } catch (categoryError) {
        console.error(
          `Failed to test ${category} category:`,
          categoryError.message
        );
        results[category] = {
          score: null,
          available: [],
          audits: 0,
          error: categoryError.message,
        };
      }
    }

    const successCount = Object.values(results).filter(
      (r) => r.score !== null
    ).length;

    return NextResponse.json({
      status: successCount > 0 ? "partial_success" : "error",
      message: `API key test completed. ${successCount}/${categories.length} categories successful.`,
      apiKeyPresent: true,
      testResults: results,
      summary: {
        totalCategories: categories.length,
        successfulCategories: successCount,
        failedCategories: categories.length - successCount,
      },
      recommendations:
        successCount === 0
          ? [
              "Check if the API key is valid",
              "Verify PageSpeed Insights API is enabled",
              "Check API quotas and rate limits",
              "Try again in a few minutes",
            ]
          : successCount < categories.length
          ? [
              "Some categories failed - this is normal for certain URLs",
              "The API key is working correctly",
              "Performance data should be available",
            ]
          : ["All categories working perfectly", "API key is fully functional"],
    });
  } catch (error) {
    console.error("API test error:", error.message);

    return NextResponse.json({
      status: "error",
      message: "API key test failed",
      apiKeyPresent: true,
      error: error.message,
      errorDetails: error.response?.data || "No additional error details",
      recommendations: [
        "Check your internet connection",
        "Verify the API key is correct",
        "Ensure PageSpeed Insights API is enabled",
        "Check if you've exceeded API quotas",
      ],
    });
  }
}
