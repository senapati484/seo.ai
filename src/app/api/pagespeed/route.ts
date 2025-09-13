/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Check for API key
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google PageSpeed API key is not configured" },
      { status: 500 }
    );
  }

  try {
    let response = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!response && attempts < maxAttempts) {
      try {
        console.log(`Attempting PageSpeed API call (attempt ${attempts + 1})`);

        // Configure API request parameters
        const params = {
          url: targetUrl,
          key: apiKey,
          strategy: "mobile",
          category: ["performance", "seo", "accessibility", "best-practices"],
          prettyPrint: false,
          utm_source: "seo-reporter",
        };

        // Make the API request
        response = await axios.get(
          "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
          {
            params,
            paramsSerializer: (params) => {
              const parts: string[] = [];
              Object.entries(params).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  value.forEach((item) => {
                    parts.push(`${key}=${encodeURIComponent(item)}`);
                  });
                } else if (value !== undefined && value !== null) {
                  parts.push(`${key}=${encodeURIComponent(value)}`);
                }
              });
              return parts.join("&");
            },
            timeout: 30000,
          }
        );

        console.log("PageSpeed API call successful");
        console.log("Full API response structure:", Object.keys(response.data));
        console.log(
          "Lighthouse result structure:",
          Object.keys(response.data.lighthouseResult || {})
        );

        // Log the raw response to understand what we're getting
        if (
          response.data.lighthouseResult &&
          response.data.lighthouseResult.categories
        ) {
          console.log(
            "Available categories:",
            Object.keys(response.data.lighthouseResult.categories)
          );
          console.log(
            "Category details:",
            response.data.lighthouseResult.categories
          );

          // Check if we got all categories
          const availableCategories = Object.keys(
            response.data.lighthouseResult.categories
          );
          const expectedCategories = [
            "performance",
            "seo",
            "accessibility",
            "best-practices",
          ];
          const missingCategories = expectedCategories.filter(
            (cat) => !availableCategories.includes(cat)
          );

          if (missingCategories.length > 0) {
            console.log(`Missing categories: ${missingCategories.join(", ")}`);
            console.log(
              "Attempting to fetch missing categories individually..."
            );

            // Try to fetch missing categories individually
            const combinedResult = {
              ...response.data.lighthouseResult,
              categories: { ...response.data.lighthouseResult.categories },
            };
            console.log(
              "Initial combined result categories:",
              Object.keys(combinedResult.categories || {})
            );

            for (const category of missingCategories) {
              try {
                console.log(`Fetching ${category} category individually...`);
                const categoryResponse = await axios.get(
                  `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`,
                  {
                    params: {
                      url: targetUrl,
                      key: apiKey,
                      strategy: "mobile",
                      category: [category],
                      prettyPrint: false,
                      utm_source: "seo-reporter",
                    },
                    timeout: 15000,
                  }
                );

                if (
                  categoryResponse.data.lighthouseResult &&
                  categoryResponse.data.lighthouseResult.categories
                ) {
                  // Log the full category response structure
                  console.log(
                    `Full ${category} response structure:`,
                    Object.keys(categoryResponse.data.lighthouseResult)
                  );
                  console.log(
                    `Categories in ${category} response:`,
                    Object.keys(
                      categoryResponse.data.lighthouseResult.categories || {}
                    )
                  );

                  // Merge the category data
                  const categoryData =
                    categoryResponse.data.lighthouseResult.categories;
                  if (categoryData && categoryData[category]) {
                    combinedResult.categories = {
                      ...combinedResult.categories,
                      [category]: categoryData[category],
                    };
                    console.log(
                      `Successfully merged ${category} category with score:`,
                      categoryData[category]?.score
                    );
                  } else {
                    console.log(`No ${category} data found in response`);
                  }
                }

                // Add delay to avoid rate limiting
                await delay(1000);
              } catch (categoryError: any) {
                console.error(
                  `Failed to fetch ${category} category individually:`,
                  categoryError.message
                );
              }
            }

            // Update response with combined data
            response.data.lighthouseResult = combinedResult;
            console.log(
              "Final combined categories:",
              Object.keys(combinedResult.categories || {})
            );
            console.log("Combined result structure:", combinedResult);
          }
        }
      } catch (error: any) {
        attempts++;
        console.error(
          `PageSpeed API attempt ${attempts} failed:`,
          error.message
        );
        if (error.response?.status === 429 && attempts < maxAttempts) {
          // Wait 2 seconds before retrying if rate limited
          await delay(2000);
          continue;
        }
        throw error;
      }
    }

    const { lighthouseResult } = response?.data;

    if (!lighthouseResult) {
      console.error("No Lighthouse data received from API");
      throw new Error("No Lighthouse data received");
    }

    console.log(
      "Lighthouse categories available:",
      Object.keys(lighthouseResult.categories || {})
    );

    // Log the full categories object for debugging
    console.log(
      "Full categories object:",
      JSON.stringify(lighthouseResult.categories, null, 2)
    );

    // Extract scores with better error handling
    const performance = lighthouseResult.categories?.performance?.score;
    const seo = lighthouseResult.categories?.seo?.score;
    const accessibility = lighthouseResult.categories?.accessibility?.score;
    const bestPractices =
      lighthouseResult.categories?.["best-practices"]?.score;

    console.log("Raw scores:", {
      performance,
      seo,
      accessibility,
      bestPractices,
    });

    // Get audits from lighthouse result
    const audits = lighthouseResult.audits || {};

    // Log the first few audits to verify we have data
    const auditKeys = Object.keys(audits);
    console.log(`Found ${auditKeys.length} audits`);
    console.log(
      "Sample audits:",
      JSON.stringify(
        Object.fromEntries(
          auditKeys.slice(0, 5).map((key) => [
            key,
            {
              score: audits[key]?.score,
              displayValue: audits[key]?.displayValue,
            },
          ])
        ),
        null,
        2
      )
    );

    // Calculate scores with fallbacks if needed
    const finalSeo = seo !== undefined ? seo : calculateSeoScore(audits);
    const finalAccessibility = accessibility !== undefined ? accessibility : 0;
    const finalBestPractices = bestPractices !== undefined ? bestPractices : 0;

    console.log("API scores with fallbacks:", {
      seo: finalSeo,
      accessibility: finalAccessibility,
      bestPractices: finalBestPractices,
    });

    // Helper function to calculate SEO score from audits if not provided
    function calculateSeoScore(audits: any) {
      const seoAudits = [
        "meta-description",
        "document-title",
        "link-text",
        "image-alt",
        "hreflang",
        "canonical",
        "robots-txt",
        "structured-data",
      ];

      const scores = seoAudits
        .map((audit) => {
          const auditResult = audits[audit];
          return auditResult?.score !== undefined ? auditResult.score : 0;
        })
        .filter((score) => score !== null);

      if (scores.length === 0) return 0;
      return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    const result = {
      performance: performance ? Math.round(performance * 100) : 0,
      seoScore: finalSeo ? Math.round(finalSeo * 100) : "API Error",
      accessibility: finalAccessibility
        ? Math.round(finalAccessibility * 100)
        : "API Error",
      bestPractices: finalBestPractices
        ? Math.round(finalBestPractices * 100)
        : "API Error",
      lcp: audits["largest-contentful-paint"]?.displayValue || "N/A",
      cls: audits["cumulative-layout-shift"]?.displayValue || "N/A",
      fcp: audits["first-contentful-paint"]?.displayValue || "N/A",
      tbt: audits["total-blocking-time"]?.displayValue || "N/A",
      si: audits["speed-index"]?.displayValue || "N/A",
      // SEO specific audits with better error handling
      metaDescription: audits["meta-description"]?.score ?? 0,
      titleLength: audits["document-title"]?.score ?? 0,
      linkText: audits["link-text"]?.score ?? 0,
      imageAlt: audits["image-alt"]?.score ?? 0,
      hreflang: audits["hreflang"]?.score ?? 0,
      canonical: audits["canonical"]?.score ?? 0,
      robotsTxt: audits["robots-txt"]?.score ?? 0,
      structuredData: audits["structured-data"]?.score ?? 0,
    };

    console.log("Final result:", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PageSpeed API error:", error.message);
    console.error("Error details:", error.response?.data);

    if (error.response?.status === 429) {
      return NextResponse.json(
        {
          error:
            "The PageSpeed API is currently rate limited. Please try again in a few minutes.",
        },
        { status: 429 }
      );
    }

    // Return error instead of fallback data
    return NextResponse.json(
      {
        error:
          "Failed to analyze the website. Please check your API key and try again.",
        details: error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}