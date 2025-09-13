import axios from "axios";
import { NextResponse } from "next/server";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  const testUrl = "https://www.google.com";

  if (!apiKey) {
    return NextResponse.json({
      status: "error",
      message: "No API key found",
    });
  }

  const results = {};

  // Test 1: Single request with all categories
  try {
    console.log("Test 1: Single request with all categories");
    const response1 = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
      {
        params: {
          url: testUrl,
          key: apiKey,
          strategy: "mobile",
          category: ["performance", "seo", "accessibility", "best-practices"],
          prettyPrint: false,
        },
        timeout: 15000,
      }
    );

    const categories1 = Object.keys(
      response1.data.lighthouseResult?.categories || {}
    );
    results.test1 = {
      success: true,
      categories: categories1,
      count: categories1.length,
    };
    console.log("Test 1 result:", categories1);
  } catch (error) {
    results.test1 = {
      success: false,
      error: error.message,
    };
  }

  await delay(2000);

  // Test 2: Single request without prettyPrint
  try {
    console.log("Test 2: Single request without prettyPrint");
    const response2 = await axios.get(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
      {
        params: {
          url: testUrl,
          key: apiKey,
          strategy: "mobile",
          category: ["performance", "seo", "accessibility", "best-practices"],
        },
        timeout: 15000,
      }
    );

    const categories2 = Object.keys(
      response2.data.lighthouseResult?.categories || {}
    );
    results.test2 = {
      success: true,
      categories: categories2,
      count: categories2.length,
    };
    console.log("Test 2 result:", categories2);
  } catch (error) {
    results.test2 = {
      success: false,
      error: error.message,
    };
  }

  await delay(2000);

  // Test 3: Individual category requests
  try {
    console.log("Test 3: Individual category requests");
    const individualCategories = [];

    for (const category of [
      "performance",
      "seo",
      "accessibility",
      "best-practices",
    ]) {
      try {
        console.log(`Testing individual ${category} request...`);
        const response = await axios.get(
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

        console.log(
          `${category} response structure:`,
          Object.keys(response.data.lighthouseResult || {})
        );
        console.log(
          `${category} categories:`,
          Object.keys(response.data.lighthouseResult?.categories || {})
        );

        if (response.data.lighthouseResult?.categories?.[category]) {
          individualCategories.push(category);
          console.log(
            `${category} score:`,
            response.data.lighthouseResult.categories[category].score
          );
        } else {
          console.log(`No ${category} category found in response`);
        }

        await delay(1000);
      } catch (error) {
        console.log(`Failed to fetch ${category}:`, error.message);
      }
    }

    results.test3 = {
      success: true,
      categories: individualCategories,
      count: individualCategories.length,
    };
    console.log("Test 3 result:", individualCategories);
  } catch (error) {
    results.test3 = {
      success: false,
      error: error.message,
    };
  }

  return NextResponse.json({
    status: "completed",
    results,
    summary: {
      test1_categories: results.test1?.categories || [],
      test2_categories: results.test2?.categories || [],
      test3_categories: results.test3?.categories || [],
      best_approach:
        results.test1?.count >= 4
          ? "single_request"
          : results.test2?.count >= 4
          ? "single_request_no_prettyprint"
          : results.test3?.count >= 4
          ? "individual_requests"
          : "none_working",
    },
  });
}
