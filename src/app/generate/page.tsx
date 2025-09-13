/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { generatePDF } from "@/lib/pdfGenerator";

const isValidUrl = (urlString: string) => {
  try {
    if (!urlString || typeof urlString !== "string") return false;
    const urlObj = new URL(urlString.trim());
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (e: any) {
    return false;
    console.log(e);
  }
};

export default function SEOAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reportData, setReportData] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setError("");
  };

  const analyzeSite = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError(
        "Please enter a valid HTTP or HTTPS URL (e.g., https://example.com)"
      );
      return;
    }

    setLoading(true);
    setError("");
    setShowReport(false);

    try {
      const encodedUrl = encodeURIComponent(url);

      // Start with content analysis as it's more reliable
      const contentResponse = await fetch("/api/content?url=" + encodedUrl);
      const contentData = await contentResponse.json();

      if (!contentResponse.ok || contentData.error) {
        throw new Error(
          contentData.error ||
            "Content analysis failed (" + contentResponse.status + ")"
        );
      }

      // Initialize report data with content analysis
      const reportData = {
        url,
        ...contentData,
        performance: "N/A (Rate Limited)",
        seoScore: contentData.calculatedScores
          ? Math.round(contentData.calculatedScores.seo * 100)
          : "N/A (Rate Limited)",
        accessibility: contentData.calculatedScores
          ? Math.round(contentData.calculatedScores.accessibility * 100)
          : "N/A (Rate Limited)",
        bestPractices: contentData.calculatedScores
          ? Math.round(contentData.calculatedScores.bestPractices * 100)
          : "N/A (Rate Limited)",
        lcp: "N/A",
        cls: "N/A",
        fcp: "N/A",
        tbt: "N/A",
        si: "N/A",
        metaDescription: 0,
        titleLength: 0,
        linkText: 0,
        imageAlt: 0,
        hreflang: 0,
        canonical: 0,
        robotsTxt: 0,
        structuredData: 0,
        keywords: null,
        backlinks: null,
      };

      // Try to get PageSpeed data
      try {
        const techResponse = await fetch("/api/pagespeed?url=" + encodedUrl);
        console.log("PageSpeed response status:", techResponse.status);

        if (techResponse.ok) {
          const techData = await techResponse.json();
          console.log("PageSpeed data received:", techData);

          if (!techData.error) {
            Object.assign(reportData, {
              performance: techData.performance,
              seoScore: techData.seoScore,
              accessibility: techData.accessibility,
              bestPractices: techData.bestPractices,
              lcp: techData.lcp,
              cls: techData.cls,
              fcp: techData.fcp,
              tbt: techData.tbt,
              si: techData.si,
              metaDescription: techData.metaDescription,
              titleLength: techData.titleLength,
              linkText: techData.linkText,
              imageAlt: techData.imageAlt,
              hreflang: techData.hreflang,
              canonical: techData.canonical,
              robotsTxt: techData.robotsTxt,
              structuredData: techData.structuredData,
            });
          } else {
            console.log("PageSpeed API returned error:", techData.error);
            // Set performance data as unavailable, but keep calculated scores from content analysis
            Object.assign(reportData, {
              performance: "API Error",
              seoScore: contentData.calculatedScores
                ? Math.round(contentData.calculatedScores.seo * 100)
                : "API Error",
              accessibility: contentData.calculatedScores
                ? Math.round(contentData.calculatedScores.accessibility * 100)
                : "API Error",
              bestPractices: contentData.calculatedScores
                ? Math.round(contentData.calculatedScores.bestPractices * 100)
                : "API Error",
              lcp: "API Error",
              cls: "API Error",
              fcp: "API Error",
              tbt: "API Error",
              si: "API Error",
            });
          }
        } else {
          console.log(
            "PageSpeed API request failed with status:",
            techResponse.status
          );
          const errorText = await techResponse.text();
          console.log("PageSpeed error response:", errorText);

          // Set performance data as unavailable, but keep calculated scores from content analysis
          Object.assign(reportData, {
            performance: "API Error",
            seoScore: contentData.calculatedScores
              ? Math.round(contentData.calculatedScores.seo * 100)
              : "API Error",
            accessibility: contentData.calculatedScores
              ? Math.round(contentData.calculatedScores.accessibility * 100)
              : "API Error",
            bestPractices: contentData.calculatedScores
              ? Math.round(contentData.calculatedScores.bestPractices * 100)
              : "API Error",
            lcp: "API Error",
            cls: "API Error",
            fcp: "API Error",
            tbt: "API Error",
            si: "API Error",
          });
        }
      } catch (error: any) {
        console.log("PageSpeed data unavailable:", error.message);

        // Set performance data as unavailable, but keep calculated scores from content analysis
        Object.assign(reportData, {
          performance: "API Error",
          seoScore: contentData.calculatedScores
            ? Math.round(contentData.calculatedScores.seo * 100)
            : "API Error",
          accessibility: contentData.calculatedScores
            ? Math.round(contentData.calculatedScores.accessibility * 100)
            : "API Error",
          bestPractices: contentData.calculatedScores
            ? Math.round(contentData.calculatedScores.bestPractices * 100)
            : "API Error",
          lcp: "API Error",
          cls: "API Error",
          fcp: "API Error",
          tbt: "API Error",
          si: "API Error",
        });
      }

      // Try to get keyword data
      try {
        const keywordResponse = await fetch("/api/keywords?url=" + encodedUrl);
        if (keywordResponse.ok) {
          const keywordData = await keywordResponse.json();
          if (!keywordData.error) {
            reportData.keywords = keywordData;
          }
        }
      } catch (error: any) {
        console.log("Keyword data unavailable:", error.message);
      }

      // Try to get backlink data
      try {
        const backlinkResponse = await fetch(
          "/api/backlinks?url=" + encodedUrl
        );
        if (backlinkResponse.ok) {
          const backlinkData = await backlinkResponse.json();
          if (!backlinkData.error) {
            reportData.backlinks = backlinkData;
          }
        }
      } catch (error: any) {
        console.log("Backlink data unavailable:", error.message);
      }

      setReportData(reportData);
      setShowReport(true);
    } catch (error: any) {
      setError(error.message || "Analysis failed. Please try again.");
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    if (reportData) {
      await generatePDF(reportData);
    }
  };

  const getScoreColor = (score: string | number) => {
    if (typeof score === "string") {
      if (score === "API Error") return "text-red-600";
      return "text-gray-500";
    }
    if (score >= 90) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = (score: string | number) => {
    if (typeof score === "string") {
      if (score === "API Error") return "API Error";
      return score;
    }
    if (score >= 90) return "Excellent";
    if (score >= 50) return "Good";
    return "Poor";
  };

  const formatBoolean = (value: boolean) => (value ? "✅ Yes" : "❌ No");

  const formatScore = (score: string | number) => {
    if (typeof score === "string") {
      if (score === "API Error") return "API Error";
      return score;
    }
    return `${score}%`;
  };

  return (
    <div className="min-h-screen py-12 px-4 top-20 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white/80 py-10 backdrop-blur-xl rounded-lg shadow-lg mt-20">
        <div className="text-center mb-8 p-6">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            🚀 Comprehensive SEO Report Generator
          </h1>
          <p className="text-2xl text-gray-600">
            Professional SEO analysis with detailed metrics and actionable
            insights
          </p>
        </div>

        {!showReport && (
          <div className="max-w-md mx-auto">
            <div className="mt-12">
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://example.com"
                disabled={loading}
                className={
                  "w-full px-5 py-4 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 " +
                  (error ? "border-red-300" : "border-gray-300")
                }
              />
            </div>

            {error && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={analyzeSite}
              disabled={!url.trim() || loading}
              className={
                "mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white " +
                (loading || !url.trim()
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700")
              }
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Generate SEO Report"
              )}
            </button>

            <p className="mt-4 text-sm text-gray-500">
              Enter a website URL to generate a comprehensive SEO analysis
              report
            </p>
          </div>
        )}

        {showReport && reportData && (
          <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg p-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    📊 SEO Analysis Report
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Analyzed URL: {reportData.url as string}
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated on: {new Date().toLocaleDateString()} at{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={generatePDFReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  📄 Download PDF
                </button>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-blue-50/80 backdrop-blur-xl border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📋 Executive Summary
              </h3>
              <p className="text-blue-800">
                This comprehensive SEO analysis covers technical performance,
                content optimization, accessibility, keyword rankings, backlink
                profile, and best practices. The report provides actionable
                insights to improve your website&lsquo;s search engine
                visibility and user experience.
              </p>
            </div>

            {/* Performance Metrics */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🚀 Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Performance</h4>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      reportData.performance as string | number
                    )}`}
                  >
                    {formatScore(reportData.performance as string | number)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getScoreStatus(reportData.performance as string | number)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">SEO Score</h4>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      reportData.seoScore
                    )}`}
                  >
                    {formatScore(reportData.seoScore)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getScoreStatus(reportData.seoScore)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Accessibility</h4>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      reportData.accessibility
                    )}`}
                  >
                    {formatScore(reportData.accessibility)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getScoreStatus(reportData.accessibility)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">
                    Best Practices
                  </h4>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(
                      reportData.bestPractices
                    )}`}
                  >
                    {formatScore(reportData.bestPractices)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getScoreStatus(reportData.bestPractices)}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Web Vitals */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                ⚡ Core Web Vitals
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">LCP</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.lcp || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Target: &lt; 2.5s</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">FCP</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.fcp || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Target: &lt; 1.8s</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">CLS</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.cls || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Target: &lt; 0.1</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">TBT</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.tbt || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Target: &lt; 200ms</p>
                </div>
              </div>
            </div>

            {/* Content Analysis */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📝 Content Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Page Title
                  </h4>
                  <p className="text-sm text-gray-900 mb-1">
                    {reportData.title || "Missing"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Length: {reportData.title ? reportData.title.length : 0}{" "}
                    characters
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Meta Description
                  </h4>
                  <p className="text-sm text-gray-900 mb-1">
                    {reportData.description || "Missing"}
                  </p>
                  <p className="text-xs text-gray-600">
                    Length:{" "}
                    {reportData.description ? reportData.description.length : 0}{" "}
                    characters
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    H1 Heading
                  </h4>
                  <p className="text-sm text-gray-900">
                    {reportData.h1 || "Missing"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Word Count
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.wordCount || 0} words
                  </p>
                  <p className="text-xs text-gray-600">
                    Target: 800-1,200 words
                  </p>
                </div>
              </div>
            </div>

            {/* Keyword Rankings */}
            {reportData.keywords && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🔍 Keyword Rankings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Total Keywords
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.keywords.totalKeywords.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Top 10 Keywords
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.keywords.top10Keywords}
                    </p>
                    <p className="text-sm text-gray-600">
                      {reportData.keywords.keywordDistribution.top10Percent}% of
                      total
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Organic Traffic
                    </h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {reportData.keywords.organicTraffic.monthly.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Monthly visitors</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Conversion Rate
                    </h4>
                    <p className="text-2xl font-bold text-orange-600">
                      {reportData.keywords.conversionRate.rate}%
                    </p>
                    <p className="text-sm text-gray-600">Target: 2-5%</p>
                  </div>
                </div>

                {/* Best Performing Keywords */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Best Performing Keywords
                  </h4>
                  <div className="space-y-2">
                    {reportData.keywords.bestPerformingKeywords.map(
                      (keyword, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-2 rounded"
                        >
                          <span className="text-sm font-medium">
                            {keyword.keyword}
                          </span>
                          <div className="text-right">
                            <span className="text-sm text-green-600 font-bold">
                              #{keyword.position}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({keyword.volume.toLocaleString()} searches)
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Backlink Profile */}
            {reportData.backlinks && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  🔗 Backlink Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Total Backlinks
                    </h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {reportData.backlinks.totalBacklinks.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Referring Domains
                    </h4>
                    <p className="text-2xl font-bold text-green-600">
                      {reportData.backlinks.referringDomains.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Target: 500+</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      Domain Authority
                    </h4>
                    <p className="text-2xl font-bold text-purple-600">
                      {reportData.backlinks.domainAuthority}/100
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700">
                      New Backlinks (30d)
                    </h4>
                    <p className="text-2xl font-bold text-orange-600">
                      +{reportData.backlinks.backlinkGrowth.last30Days}
                    </p>
                  </div>
                </div>

                {/* Top Referring Domains */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Top Referring Domains
                  </h4>
                  <div className="space-y-2">
                    {reportData.backlinks.topReferringDomains
                      .slice(0, 5)
                      .map((domain, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-2 rounded"
                        >
                          <span className="text-sm font-medium">
                            {domain.domain}
                          </span>
                          <div className="text-right">
                            <span className="text-sm text-blue-600 font-bold">
                              DA: {domain.authority}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({domain.backlinks} links)
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Technical SEO */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🔧 Technical SEO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">
                    Meta Completeness
                  </h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {reportData.metaCompleteness}%
                  </p>
                  <p className="text-sm text-gray-600">Target: 90%+</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">
                    Mobile Optimization
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {formatBoolean(reportData.mobileOptimized)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">
                    Structured Data
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {formatBoolean(reportData.structuredData?.present)}
                  </p>
                  {reportData.structuredData?.present && (
                    <p className="text-sm text-gray-600">
                      {reportData.structuredData.count} schemas found
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Hreflang Tags</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {formatBoolean(reportData.hreflang?.present)}
                  </p>
                  {reportData.hreflang?.present && (
                    <p className="text-sm text-gray-600">
                      {reportData.hreflang.count} languages
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">Canonical URL</h4>
                  <p className="text-lg font-bold text-gray-900">
                    {formatBoolean(reportData.canonical)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700">
                    Content Freshness
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {reportData.contentFreshness?.isFresh
                      ? "✅ Fresh"
                      : "⚠️ Needs Update"}
                  </p>
                  {reportData.contentFreshness?.ageInDays && (
                    <p className="text-sm text-gray-600">
                      {reportData.contentFreshness.ageInDays} days old
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🎯 Actionable Recommendations
              </h3>
              <div className="space-y-3">
                {reportData.performance < 90 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <strong className="text-red-800">Performance:</strong>{" "}
                    Optimize images, minify CSS/JS, and implement caching to
                    improve loading speed.
                  </div>
                )}
                {reportData.seoScore < 90 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <strong className="text-yellow-800">SEO:</strong> Improve
                    meta descriptions, add missing alt text, and optimize
                    heading structure.
                  </div>
                )}
                {reportData.accessibility < 90 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <strong className="text-blue-800">Accessibility:</strong>{" "}
                    Add ARIA labels, improve color contrast, and ensure keyboard
                    navigation.
                  </div>
                )}
                {!reportData.mobileOptimized && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <strong className="text-purple-800">Mobile:</strong> Add
                    viewport meta tag and ensure responsive design.
                  </div>
                )}
                {!reportData.ogData.title && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <strong className="text-green-800">Social Media:</strong>{" "}
                    Add Open Graph and Twitter Card meta tags for better social
                    sharing.
                  </div>
                )}
                {!reportData.structuredData?.present && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <strong className="text-indigo-800">
                      Structured Data:
                    </strong>{" "}
                    Implement JSON-LD structured data for rich snippets.
                  </div>
                )}
                {reportData.images?.withoutAlt > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <strong className="text-orange-800">Images:</strong> Add
                    descriptive alt text to all images for accessibility and
                    SEO.
                  </div>
                )}
                {!reportData.canonical && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                    <strong className="text-pink-800">Canonical:</strong> Add
                    canonical URL to prevent duplicate content issues.
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                📈 Next Steps
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-yellow-800">
                <li>Prioritize fixing critical issues (red scores) first</li>
                <li>
                  Implement performance optimizations for better Core Web Vitals
                </li>
                <li>Add missing meta tags and structured data</li>
                <li>Improve content quality and keyword optimization</li>
                <li>Monitor progress with regular SEO audits</li>
              </ol>
            </div>

            {/* Back to Analysis Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setShowReport(false);
                  setReportData(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              >
                🔄 Analyze Another URL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
