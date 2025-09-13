import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const testUrl = "https://www.google.com";

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "No API key found",
    });
  }

  try {
    // Test with no category parameter to see what's available
    console.log("Testing API key with no category parameter...");
    const response = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
      {
        params: {
          url: testUrl,
          key: apiKey,
          strategy: "mobile",
          prettyPrint: false,
        },
        timeout: 15000,
      }
    );

    const availableCategories = Object.keys(
      response.data.lighthouseResult?.categories || {}
    );

    console.log(
      "Available categories with no category parameter:",
      availableCategories
    );

    // Test each category individually
    const categoryTests = {};

    for (const category of [
      "performance",
      "seo",
      "accessibility",
      "best-practices",
    ]) {
      try {
        console.log(`Testing ${category} category...`);
        const catResponse = await axios.get(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
          {
            params: {
              url: testUrl,
              key: apiKey,
              strategy: "mobile",
              category: [category],
              prettyPrint: false,
            },
            timeout: 10000,
          }
        );

        const catCategories = Object.keys(
          catResponse.data.lighthouseResult?.categories || {}
        );
        const hasCategory = catCategories.includes(category);
        const score =
          catResponse.data.lighthouseResult?.categories?.[category]?.score;

        categoryTests[category] = {
          success: true,
          available: catCategories,
          hasRequestedCategory: hasCategory,
          score: score,
        };

        console.log(`${category} test result:`, categoryTests[category]);

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        categoryTests[category] = {
          success: false,
          error: error.message,
        };
        console.log(`${category} test failed:`, error.message);
      }
    }

    return NextResponse.json({
      status: "completed",
      apiKeyPresent: true,
      defaultCategories: availableCategories,
      categoryTests: categoryTests,
      summary: {
        totalCategories: availableCategories.length,
        workingCategories: Object.values(categoryTests).filter(
          (test) => test.success && test.hasRequestedCategory
        ).length,
        issues: Object.entries(categoryTests)
          .filter(([cat, test]) => !test.success || !test.hasRequestedCategory)
          .map(([cat, test]) => `${cat}: ${test.error || "not found"}`),
      },
    });
  } catch (error) {
    console.error("API key test failed:", error.message);
    return NextResponse.json({
      status: "error",
      message: `API key test failed: ${error.message}`,
      apiKeyPresent: true,
      errorDetails: error.response?.data || error.message,
    });
  }
}
