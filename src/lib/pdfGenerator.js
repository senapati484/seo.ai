"use client";

export const generatePDF = async (data) => {
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    // Create a styled container
    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.maxWidth = "800px";
    element.style.margin = "0 auto";

    // Helper function to get score color
    const getScoreColor = (score) => {
      if (typeof score === "string") {
        if (score === "API Error") return "#dc3545";
        return "#666";
      }
      if (score >= 90) return "#28a745";
      if (score >= 50) return "#ffc107";
      return "#dc3545";
    };

    // Helper function to get score status
    const getScoreStatus = (score) => {
      if (typeof score === "string") {
        if (score === "API Error") return "API Error";
        return score;
      }
      if (score >= 90) return "Excellent";
      if (score >= 50) return "Good";
      return "Poor";
    };

    // Helper function to format boolean
    const formatBoolean = (value) => (value ? "✅ Yes" : "❌ No");

    // Helper function to format score
    const formatScore = (score) => {
      if (typeof score === "string") {
        if (score === "API Error") return "API Error";
        return score;
      }
      return `${score}%`;
    };

    // Create styled HTML template
    element.innerHTML = `
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                h1 { color: #2c3e50; margin-bottom: 20px; text-align: center; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
                h2 { color: #34495e; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #3498db; padding-left: 15px; }
                h3 { color: #2c3e50; margin-top: 20px; margin-bottom: 10px; }
                .score { font-size: 1.3em; font-weight: bold; padding: 10px; border-radius: 5px; margin: 10px 0; }
                .metric { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #dee2e6; }
                .metric.good { border-left-color: #28a745; }
                .metric.warning { border-left-color: #ffc107; }
                .metric.poor { border-left-color: #dc3545; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0; }
                .full-width { grid-column: 1 / -1; }
                .status { font-weight: bold; }
                .recommendation { background: #e3f2fd; padding: 10px; border-radius: 5px; margin: 5px 0; border-left: 4px solid #2196f3; }
                .summary { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7; }
                .url { background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; }
                .date { text-align: right; color: #666; font-size: 0.9em; margin-bottom: 20px; }
                .keyword-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                .keyword-table th, .keyword-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .keyword-table th { background-color: #f2f2f2; font-weight: bold; }
                .backlink-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                .backlink-table th, .backlink-table td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 0.9em; }
                .backlink-table th { background-color: #f2f2f2; font-weight: bold; }
            </style>
            
            <div class="date">Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
            
            <h1>📊 Comprehensive SEO Analysis Report</h1>
            
            <div class="url">
                <strong>Analyzed URL:</strong> ${data.url || "N/A"}
            </div>

            <div class="summary">
                <h3>📋 Executive Summary</h3>
                <p>This comprehensive SEO analysis covers technical performance, content optimization, accessibility, keyword rankings, backlink profile, and best practices. The report provides actionable insights to improve your website's search engine visibility and user experience.</p>
            </div>
            
            <h2>🚀 Performance Metrics</h2>
            <div class="grid">
                <div class="metric ${data.performance >= 90
        ? "good"
        : data.performance >= 50
          ? "warning"
          : "poor"
      }">
                    <h3>Performance Score</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.performance
      )}">
                        ${formatScore(data.performance)} - ${getScoreStatus(
        data.performance
      )}
                    </div>
                </div>
                
                <div class="metric ${data.seoScore >= 90
        ? "good"
        : data.seoScore >= 50
          ? "warning"
          : "poor"
      }">
                    <h3>SEO Score</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.seoScore
      )}">
                        ${formatScore(data.seoScore)} - ${getScoreStatus(
        data.seoScore
      )}
                    </div>
                </div>
                
                <div class="metric ${data.accessibility >= 90
        ? "good"
        : data.accessibility >= 50
          ? "warning"
          : "poor"
      }">
                    <h3>Accessibility Score</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.accessibility
      )}">
                        ${formatScore(data.accessibility)} - ${getScoreStatus(
        data.accessibility
      )}
                    </div>
                </div>
                
                <div class="metric ${data.bestPractices >= 90
        ? "good"
        : data.bestPractices >= 50
          ? "warning"
          : "poor"
      }">
                    <h3>Best Practices Score</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.bestPractices
      )}">
                        ${formatScore(data.bestPractices)} - ${getScoreStatus(
        data.bestPractices
      )}
                    </div>
                </div>
            </div>

            <h2>⚡ Core Web Vitals</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Largest Contentful Paint (LCP)</h3>
                    <p><strong>${data.lcp || "N/A"}</strong></p>
                    <p class="recommendation">Target: &lt; 2.5 seconds for good user experience</p>
                </div>
                
                <div class="metric">
                    <h3>First Contentful Paint (FCP)</h3>
                    <p><strong>${data.fcp || "N/A"}</strong></p>
                    <p class="recommendation">Target: &lt; 1.8 seconds for good user experience</p>
                </div>
                
                <div class="metric">
                    <h3>Cumulative Layout Shift (CLS)</h3>
                    <p><strong>${data.cls || "N/A"}</strong></p>
                    <p class="recommendation">Target: &lt; 0.1 for good user experience</p>
                </div>
                
                <div class="metric">
                    <h3>Total Blocking Time (TBT)</h3>
                    <p><strong>${data.tbt || "N/A"}</strong></p>
                    <p class="recommendation">Target: &lt; 200ms for good user experience</p>
                </div>
            </div>

            ${data.keywords
        ? `
            <h2>🔍 Keyword Rankings</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Total Keywords</h3>
                    <p><strong>${data.keywords.totalKeywords.toLocaleString()}</strong></p>
                    <p class="recommendation">Keywords tracked in search results</p>
                </div>
                
                <div class="metric">
                    <h3>Top 10 Keywords</h3>
                    <p><strong>${data.keywords.top10Keywords}</strong> (${data.keywords.keywordDistribution.top10Percent
        }%)</p>
                    <p class="recommendation">Target: 20-30%+ in Top 10</p>
                </div>
                
                <div class="metric">
                    <h3>Organic Traffic</h3>
                    <p><strong>${data.keywords.organicTraffic.monthly.toLocaleString()}</strong> monthly visitors</p>
                    <p class="recommendation">Trend: ${data.keywords.organicTraffic.trend
        } (${data.keywords.organicTraffic.change}%)</p>
                </div>
                
                <div class="metric">
                    <h3>Conversion Rate</h3>
                    <p><strong>${data.keywords.conversionRate.rate
        }%</strong></p>
                    <p class="recommendation">Target: 2-5% (Benchmark: ${data.keywords.conversionRate.benchmark
        })</p>
                </div>
            </div>

            <h3>Best Performing Keywords</h3>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Position</th>
                        <th>Search Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.keywords.bestPerformingKeywords
          .map(
            (keyword) => `
                        <tr>
                            <td>${keyword.keyword}</td>
                            <td>#${keyword.position}</td>
                            <td>${keyword.volume.toLocaleString()}</td>
                        </tr>
                    `
          )
          .join("")}
                </tbody>
            </table>

            <h3>Keyword Opportunities</h3>
            <table class="keyword-table">
                <thead>
                    <tr>
                        <th>Keyword</th>
                        <th>Difficulty</th>
                        <th>Search Volume</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.keywords.keywordOpportunities
          .map(
            (keyword) => `
                        <tr>
                            <td>${keyword.keyword}</td>
                            <td>${keyword.difficulty}</td>
                            <td>${keyword.volume.toLocaleString()}</td>
                        </tr>
                    `
          )
          .join("")}
                </tbody>
            </table>
            `
        : ""
      }

            ${data.backlinks
        ? `
            <h2>🔗 Backlink Profile</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Total Backlinks</h3>
                    <p><strong>${data.backlinks.totalBacklinks.toLocaleString()}</strong></p>
                    <p class="recommendation">Total backlinks pointing to your site</p>
                </div>
                
                <div class="metric">
                    <h3>Referring Domains</h3>
                    <p><strong>${data.backlinks.referringDomains.toLocaleString()}</strong></p>
                    <p class="recommendation">Target: 500+ (quality matters)</p>
                </div>
                
                <div class="metric">
                    <h3>Domain Authority</h3>
                    <p><strong>${data.backlinks.domainAuthority
        }/100</strong></p>
                    <p class="recommendation">Overall domain strength score</p>
                </div>
                
                <div class="metric">
                    <h3>New Backlinks (30d)</h3>
                    <p><strong>+${data.backlinks.backlinkGrowth.last30Days
        }</strong></p>
                    <p class="recommendation">Growth trend: ${data.backlinks.backlinkGrowth.trend
        }</p>
                </div>
            </div>

            <h3>Top Referring Domains</h3>
            <table class="backlink-table">
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Authority</th>
                        <th>Backlinks</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.backlinks.topReferringDomains
          .slice(0, 8)
          .map(
            (domain) => `
                        <tr>
                            <td>${domain.domain}</td>
                            <td>${domain.authority}</td>
                            <td>${domain.backlinks}</td>
                            <td>${domain.type}</td>
                        </tr>
                    `
          )
          .join("")}
                </tbody>
            </table>

            <h3>Backlink Quality Distribution</h3>
            <div class="grid">
                <div class="metric">
                    <h4>High Quality</h4>
                    <p><strong>${data.backlinks.backlinkQuality.high.toLocaleString()}</strong> (${data.backlinks.backlinkQuality.highPercent
        }%)</p>
                </div>
                <div class="metric">
                    <h4>Medium Quality</h4>
                    <p><strong>${data.backlinks.backlinkQuality.medium.toLocaleString()}</strong> (${data.backlinks.backlinkQuality.mediumPercent
        }%)</p>
                </div>
                <div class="metric">
                    <h4>Low Quality</h4>
                    <p><strong>${data.backlinks.backlinkQuality.low.toLocaleString()}</strong> (${data.backlinks.backlinkQuality.lowPercent
        }%)</p>
                </div>
            </div>
            `
        : ""
      }

            <h2>📝 Content Analysis</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Page Title</h3>
                    <p><strong>${data.title || "Missing"}</strong></p>
                    <p>Length: ${data.title ? data.title.length : 0
      } characters</p>
                    <p class="recommendation">${data.title && data.title.length > 60
        ? "⚠️ Title is too long (max 60 characters recommended)"
        : "✅ Title length is optimal"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Meta Description</h3>
                    <p><strong>${data.description || "Missing"}</strong></p>
                    <p>Length: ${data.description ? data.description.length : 0
      } characters</p>
                    <p class="recommendation">${data.description && data.description.length > 160
        ? "⚠️ Description is too long (max 160 characters recommended)"
        : "✅ Description length is optimal"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>H1 Heading</h3>
                    <p><strong>${data.h1 || "Missing"}</strong></p>
                    <p class="recommendation">${data.h1
        ? "✅ H1 heading is present"
        : "❌ H1 heading is missing - add a descriptive H1"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Word Count</h3>
                    <p><strong>${data.wordCount || 0} words</strong></p>
                    <p class="recommendation">${data.wordCount >= 800
        ? "✅ Good content length"
        : data.wordCount >= 300
          ? "⚠️ Consider adding more content (800-1,200 words recommended)"
          : "❌ Content is too short (800-1,200 words recommended)"
      }</p>
                </div>
            </div>

            <h2>🔧 Technical SEO Elements</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Meta Completeness</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.metaCompleteness
      )}">
                        ${formatScore(
        data.metaCompleteness
      )} - ${getScoreStatus(data.metaCompleteness)}
                    </div>
                    <p class="recommendation">Target: 90%+ completeness</p>
                </div>
                
                <div class="metric">
                    <h3>Title Length</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.titleLength * 100
      )}">
                        ${Math.round(
        data.titleLength * 100
      )}% - ${getScoreStatus(data.titleLength * 100)}
                    </div>
                </div>
                
                <div class="metric">
                    <h3>Link Text</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.linkText * 100
      )}">
                        ${Math.round(data.linkText * 100)}% - ${getScoreStatus(
        data.linkText * 100
      )}
                    </div>
                </div>
                
                <div class="metric">
                    <h3>Image Alt Text</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.imageAlt * 100
      )}">
                        ${Math.round(data.imageAlt * 100)}% - ${getScoreStatus(
        data.imageAlt * 100
      )}
                    </div>
                </div>
                
                <div class="metric">
                    <h3>Canonical URL</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.canonical * 100
      )}">
                        ${Math.round(data.canonical * 100)}% - ${getScoreStatus(
        data.canonical * 100
      )}
                    </div>
                </div>
                
                <div class="metric">
                    <h3>Structured Data</h3>
                    <div class="score" style="color: ${getScoreColor(
        data.structuredData * 100
      )}">
                        ${Math.round(
        data.structuredData * 100
      )}% - ${getScoreStatus(data.structuredData * 100)}
                    </div>
                </div>
            </div>

            <h2>📱 Social Media & Mobile</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Mobile Optimization</h3>
                    <p><strong>${formatBoolean(
        data.mobileOptimized
      )}</strong></p>
                    <p class="recommendation">${data.mobileOptimized
        ? "✅ Viewport meta tag is present"
        : "❌ Add viewport meta tag for mobile optimization"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Open Graph Data</h3>
                    <p><strong>${formatBoolean(
        data.ogData.title || data.ogData.description
      )}</strong></p>
                    <p class="recommendation">${data.ogData.title || data.ogData.description
        ? "✅ Open Graph tags are present"
        : "❌ Add Open Graph tags for better social sharing"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Twitter Cards</h3>
                    <p><strong>${formatBoolean(
        data.twitterData.card
      )}</strong></p>
                    <p class="recommendation">${data.twitterData.card
        ? "✅ Twitter Card tags are present"
        : "❌ Add Twitter Card tags for better Twitter sharing"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Contact CTA</h3>
                    <p><strong>${formatBoolean(data.hasContactCTA)}</strong></p>
                    <p class="recommendation">${data.hasContactCTA
        ? "✅ Contact call-to-action is present"
        : "❌ Add contact call-to-action for better conversion"
      }</p>
                </div>
            </div>

            <h2>📊 Content Structure</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Heading Structure</h3>
                    <p><strong>H1:</strong> ${data.headings?.h1?.length || 0
      }</p>
                    <p><strong>H2:</strong> ${data.headings?.h2?.length || 0
      }</p>
                    <p><strong>H3:</strong> ${data.headings?.h3?.length || 0
      }</p>
                    <p class="recommendation">${data.headings?.h1?.length === 1
        ? "✅ Proper H1 structure"
        : "⚠️ Ensure exactly one H1 per page"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Images Analysis</h3>
                    <p><strong>Total Images:</strong> ${data.images?.total || 0
      }</p>
                    <p><strong>With Alt Text:</strong> ${data.images?.withAlt || 0
      }</p>
                    <p><strong>Without Alt Text:</strong> ${data.images?.withoutAlt || 0
      }</p>
                    <p class="recommendation">${data.images?.withoutAlt > 0
        ? "⚠️ Add alt text to all images"
        : "✅ All images have alt text"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Links Analysis</h3>
                    <p><strong>Total Links:</strong> ${data.links?.total || 0
      }</p>
                    <p><strong>With Text:</strong> ${data.links?.withText || 0
      }</p>
                    <p><strong>Without Text:</strong> ${data.links?.withoutText || 0
      }</p>
                    <p class="recommendation">${data.links?.withoutText > 0
        ? "⚠️ Add descriptive text to all links"
        : "✅ All links have descriptive text"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Structured Data</h3>
                    <p><strong>Present:</strong> ${formatBoolean(
        data.structuredData?.present
      )}</p>
                    <p><strong>Count:</strong> ${data.structuredData?.count || 0
      }</p>
                    <p class="recommendation">${data.structuredData?.present
        ? "✅ Structured data is implemented"
        : "❌ Add structured data for better search results"
      }</p>
                </div>
            </div>

            <h2>🌍 International SEO</h2>
            <div class="grid">
                <div class="metric">
                    <h3>Hreflang Tags</h3>
                    <p><strong>${formatBoolean(
        data.hreflang?.present
      )}</strong></p>
                    <p class="recommendation">${data.hreflang?.present
        ? `✅ Hreflang implemented (${data.hreflang.count} languages)`
        : "❌ Add hreflang tags for international SEO"
      }</p>
                </div>
                
                <div class="metric">
                    <h3>Content Freshness</h3>
                    <p><strong>${data.contentFreshness?.isFresh
        ? "✅ Fresh"
        : "⚠️ Needs Update"
      }</strong></p>
                    <p class="recommendation">${data.contentFreshness?.ageInDays
        ? `${data.contentFreshness.ageInDays} days old (Target: < 18 months)`
        : "Last modified date not available"
      }</p>
                </div>
            </div>

            <h2>🎯 Actionable Recommendations</h2>
            <div class="full-width">
                ${data.performance < 90
        ? '<div class="recommendation"><strong>Performance:</strong> Optimize images, minify CSS/JS, and implement caching to improve loading speed.</div>'
        : ""
      }
                ${data.seoScore < 90
        ? '<div class="recommendation"><strong>SEO:</strong> Improve meta descriptions, add missing alt text, and optimize heading structure.</div>'
        : ""
      }
                ${data.accessibility < 90
        ? '<div class="recommendation"><strong>Accessibility:</strong> Add ARIA labels, improve color contrast, and ensure keyboard navigation.</div>'
        : ""
      }
                ${!data.mobileOptimized
        ? '<div class="recommendation"><strong>Mobile:</strong> Add viewport meta tag and ensure responsive design.</div>'
        : ""
      }
                ${!data.ogData.title
        ? '<div class="recommendation"><strong>Social Media:</strong> Add Open Graph and Twitter Card meta tags for better social sharing.</div>'
        : ""
      }
                ${!data.structuredData?.present
        ? '<div class="recommendation"><strong>Structured Data:</strong> Implement JSON-LD structured data for rich snippets.</div>'
        : ""
      }
                ${data.images?.withoutAlt > 0
        ? '<div class="recommendation"><strong>Images:</strong> Add descriptive alt text to all images for accessibility and SEO.</div>'
        : ""
      }
                ${!data.canonical
        ? '<div class="recommendation"><strong>Canonical:</strong> Add canonical URL to prevent duplicate content issues.</div>'
        : ""
      }
                ${!data.hreflang?.present
        ? '<div class="recommendation"><strong>International:</strong> Add hreflang tags for better international SEO.</div>'
        : ""
      }
                ${data.wordCount < 800
        ? '<div class="recommendation"><strong>Content:</strong> Increase content length to 800-1,200 words for better SEO performance.</div>'
        : ""
      }
                ${data.metaCompleteness < 90
        ? '<div class="recommendation"><strong>Meta Tags:</strong> Complete missing meta tags to improve search visibility.</div>'
        : ""
      }
            </div>

            <div class="summary">
                <h3>📈 Next Steps</h3>
                <p>1. Prioritize fixing critical issues (red scores) first</p>
                <p>2. Implement performance optimizations for better Core Web Vitals</p>
                <p>3. Add missing meta tags and structured data</p>
                <p>4. Improve content quality and keyword optimization</p>
                <p>5. Monitor progress with regular SEO audits</p>
                <p>6. Focus on building quality backlinks from authoritative domains</p>
                <p>7. Optimize for target keywords with high search volume</p>
            </div>
        `;

    // PDF generation options
    const opt = {
      margin: 1,
      filename: `seo-report-${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, logging: false },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    };

    // Generate and download PDF
    await html2pdf().set(opt).from(element).save();

    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};
