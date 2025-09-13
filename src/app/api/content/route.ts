/* eslint-disable @typescript-eslint/no-explicit-any */
import { chromium } from "playwright";
import { NextResponse } from "next/server";
import * as child_process from "child_process";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    console.log('Attempting to launch browser...');
    let browser;

    // const { execSync } = require('child_process');
    const { execSync } = child_process;

    try {
      // First try to launch the browser
      browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ]
      });
    } catch (firstError: any) {
      console.error('Failed to launch bundled Chromium:', firstError);

      // If browser is not installed, try to install it
      if (firstError.message.includes('Looks like Playwright')) {
        console.log('Installing Playwright browsers...');
        try {
          execSync('npx playwright install chromium --with-deps', { stdio: 'inherit' });
          // Retry browser launch after installation
          browser = await chromium.launch({
            headless: true,
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage',
              '--disable-accelerated-2d-canvas',
              '--disable-gpu'
            ]
          });
        } catch (installError) {
          console.error('Failed to install browser:', installError);
          // Try system Chrome as fallback
          console.log('Attempting to use system Chrome...');
          browser = await chromium.launch({
            headless: true,
            channel: 'chrome',
            args: [
              '--no-sandbox',
              '--disable-setuid-sandbox',
              '--disable-dev-shm-usage'
            ]
          });
        }
      } else {
        // If error is not about missing browser, try system Chrome
        console.log('Attempting to use system Chrome...');
        browser = await chromium.launch({
          headless: true,
          channel: 'chrome',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
          ]
        });
      }
    }

    if (!browser) {
      throw new Error('Failed to launch any browser. Please run: npx playwright install chromium');
    }

    console.log('Setting up browser context...');
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36'
    });

    console.log('Creating new page...');
    const page = await context.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    try {
      console.log('Navigating to:', targetUrl);
      // Navigate to the page with a timeout
      const response = await page.goto(targetUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      if (!response?.ok()) {
        throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`);
      }

      // Extract the content data
      const contentData = await page.evaluate(() => {
        const getTextContent = (selector: string) => {
          const element = document.querySelector(selector);
          return element ? (element as HTMLElement).innerText.trim() : "Missing";
        };

        const getMetaContent = (name: string) => {
          const meta = document.querySelector(`meta[name="${name}"]`);
          return meta ? meta.getAttribute("content") : null;
        };

        const getMetaProperty = (property: string) => {
          const meta = document.querySelector(`meta[property="${property}"]`);
          return meta ? meta.getAttribute("content") : null;
        };

        // Get meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        const description = metaDesc
          ? metaDesc.getAttribute("content")
          : "Missing";

        // Get all text content
        const bodyText = document.body.innerText.toLowerCase();
        const wordCount = bodyText.trim().split(/\s+/).length;

        // Get all headings
        const headings = {
          h1: Array.from(document.querySelectorAll("h1")).map((h) =>
            h.innerText.trim()
          ),
          h2: Array.from(document.querySelectorAll("h2")).map((h) =>
            h.innerText.trim()
          ),
          h3: Array.from(document.querySelectorAll("h3")).map((h) =>
            h.innerText.trim()
          ),
        };

        // Get all images
        const images = Array.from(document.querySelectorAll("img")).map(
          (img) => ({
            src: img.src,
            alt: img.alt,
            hasAlt: !!img.alt && img.alt.trim() !== "",
          })
        );

        // Get all links
        const links = Array.from(document.querySelectorAll("a")).map(
          (link) => ({
            href: link.href,
            text: link.innerText.trim(),
            hasText: !!link.innerText.trim(),
          })
        );

        // Check for structured data
        const structuredData = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        )
          .map((script) => {
            try {
              return JSON.parse((script as HTMLElement).innerText);
            } catch (e: any) {
              return null;
            }
          })
          .filter((data) => data !== null);

        // Get viewport meta
        const viewport = document.querySelector('meta[name="viewport"]');
        const isMobileOptimized = !!viewport;

        // Get robots meta
        const robots = getMetaContent("robots");

        // Get canonical URL
        const canonical = document.querySelector('link[rel="canonical"]');
        const canonicalUrl = canonical ? (canonical as HTMLLinkElement).href : null;

        // Get Open Graph data
        const ogData = {
          title: getMetaProperty("og:title"),
          description: getMetaProperty("og:description"),
          image: getMetaProperty("og:image"),
          url: getMetaProperty("og:url"),
        };

        // Get Twitter Card data
        const twitterData = {
          card: getMetaProperty("twitter:card"),
          title: getMetaProperty("twitter:title"),
          description: getMetaProperty("twitter:description"),
          image: getMetaProperty("twitter:image"),
        };

        // Check for hreflang tags (International SEO)
        const hreflangTags = Array.from(
          document.querySelectorAll('link[rel="alternate"][hreflang]')
        ).map((link) => ({
          lang: link.getAttribute("hreflang"),
          href: link.getAttribute("href"),
        }));

        // Get last modified date
        const lastModified =
          getMetaContent("last-modified") ||
          document
            .querySelector('meta[http-equiv="last-modified"]')
            ?.getAttribute("content") ||
          null;

        // Calculate content freshness
        const contentAge = lastModified
          ? Math.floor(
            (new Date().getTime() - new Date(lastModified as string).getTime()) /
            (1000 * 60 * 60 * 24)
          )
          : null;


        // Check for schema markup types
        const schemaTypes = structuredData.map((data) => {
          if (data["@type"]) return data["@type"];
          if (data["@context"] && data["@context"].includes("schema.org"))
            return "Schema.org";
          return "Unknown";
        });

        // Get all meta tags for completeness check
        const allMetaTags = Array.from(document.querySelectorAll("meta")).map(
          (meta) => ({
            name: meta.getAttribute("name") || meta.getAttribute("property"),
            content: meta.getAttribute("content"),
          })
        );

        // Check for important meta tags
        const importantMetaTags = {
          title: !!document.title,
          description: !!description && description !== "Missing",
          keywords: !!getMetaContent("keywords"),
          author: !!getMetaContent("author"),
          viewport: !!viewport,
          robots: !!robots,
          canonical: !!canonicalUrl,
        };

        // Calculate meta completeness percentage
        const metaCompleteness =
          (Object.values(importantMetaTags).filter(Boolean).length /
            Object.keys(importantMetaTags).length) *
          100;

        // Calculate SEO score based on content analysis
        const calculateSEOScore = () => {
          let score = 0;
          let totalChecks = 0;

          // Title check (0-20 points)
          if (
            document.title &&
            document.title.length > 10 &&
            document.title.length < 60
          ) {
            score += 20;
          } else if (document.title) {
            score += 10;
          }
          totalChecks += 20;

          // Meta description check (0-20 points)
          if (
            description &&
            description !== "Missing" &&
            description.length > 50 &&
            description.length < 160
          ) {
            score += 20;
          } else if (description && description !== "Missing") {
            score += 10;
          }
          totalChecks += 20;

          // H1 check (0-15 points)
          if (headings.h1.length === 1) {
            score += 15;
          } else if (headings.h1.length > 1) {
            score += 5;
          }
          totalChecks += 15;

          // Image alt text check (0-15 points)
          const altTextRatio =
            images.length > 0
              ? images.filter((img) => img.hasAlt).length / images.length
              : 1;
          score += altTextRatio * 15;
          totalChecks += 15;

          // Link text check (0-10 points)
          const linkTextRatio =
            links.length > 0
              ? links.filter((link) => link.hasText).length / links.length
              : 1;
          score += linkTextRatio * 10;
          totalChecks += 10;

          // Structured data check (0-10 points)
          if (structuredData.length > 0) {
            score += 10;
          }
          totalChecks += 10;

          // Canonical URL check (0-5 points)
          if (canonicalUrl) {
            score += 5;
          }
          totalChecks += 5;

          // Hreflang check (0-5 points)
          if (hreflangTags.length > 0) {
            score += 5;
          }
          totalChecks += 5;

          return totalChecks > 0 ? score / totalChecks : 0;
        };

        // Calculate Accessibility score
        const calculateAccessibilityScore = () => {
          let score = 0;
          let totalChecks = 0;

          // Image alt text (0-30 points)
          const altTextRatio =
            images.length > 0
              ? images.filter((img) => img.hasAlt).length / images.length
              : 1;
          score += altTextRatio * 30;
          totalChecks += 30;

          // Link text (0-25 points)
          const linkTextRatio =
            links.length > 0
              ? links.filter((link) => link.hasText).length / links.length
              : 1;
          score += linkTextRatio * 25;
          totalChecks += 25;

          // Heading structure (0-25 points)
          const hasH1 = headings.h1.length > 0;
          const hasH2 = headings.h2.length > 0;
          const hasH3 = headings.h3.length > 0;
          if (hasH1 && hasH2) score += 25;
          else if (hasH1) score += 15;
          else if (hasH2) score += 10;
          totalChecks += 25;

          // Meta viewport (0-20 points)
          if (viewport) {
            score += 20;
          }
          totalChecks += 20;

          return totalChecks > 0 ? score / totalChecks : 0;
        };

        // Calculate Best Practices score
        const calculateBestPracticesScore = () => {
          let score = 0;
          let totalChecks = 0;

          // HTTPS check (0-25 points) - assume HTTPS for now
          score += 25;
          totalChecks += 25;

          // Meta viewport (0-25 points)
          if (viewport) {
            score += 25;
          }
          totalChecks += 25;

          // Structured data (0-25 points)
          if (structuredData.length > 0) {
            score += 25;
          }
          totalChecks += 25;

          // Canonical URL (0-25 points)
          if (canonicalUrl) {
            score += 25;
          }
          totalChecks += 25;

          return totalChecks > 0 ? score / totalChecks : 0;
        };

        const seoScore = calculateSEOScore();
        const accessibilityScore = calculateAccessibilityScore();
        const bestPracticesScore = calculateBestPracticesScore();

        return {
          title: document.title || "Missing",
          h1: getTextContent("h1"),
          wordCount,
          description,
          hasContactCTA:
            bodyText.includes("contact") ||
            bodyText.includes("enroll") ||
            bodyText.includes("download"),
          headings,
          images: {
            total: images.length,
            withAlt: images.filter((img) => img.hasAlt).length,
            withoutAlt: images.filter((img) => !img.hasAlt).length,
          },
          links: {
            total: links.length,
            withText: links.filter((link) => link.hasText).length,
            withoutText: links.filter((link) => !link.hasText).length,
          },
          structuredData: {
            present: structuredData.length > 0,
            count: structuredData.length,
            types: schemaTypes,
          },
          isMobileOptimized,
          robots,
          canonicalUrl,
          ogData,
          twitterData,
          hreflangTags,
          lastModified,
          contentAge,
          allMetaTags,
          importantMetaTags,
          metaCompleteness,
          // Add calculated scores
          calculatedScores: {
            seo: seoScore,
            accessibility: accessibilityScore,
            bestPractices: bestPracticesScore,
          },
        };
      });

      return NextResponse.json(contentData);
    } catch (navError: any) {
      console.error('Navigation error:', navError);
      return NextResponse.json(
        {
          error: `Failed to load the website: ${navError.message}. Please check if the URL is accessible.`,
        },
        { status: 400 }
      );
    } finally {
      try {
        if (page) await page.close();
        if (context) await context.close();
        if (browser) await browser.close();
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }
    }
  } catch (error: any) {
    console.error("Content analysis error:", error);

    // Check for specific Playwright installation/launch errors
    if (error.message.includes('playwright') || error.message.includes('browser')) {
      return NextResponse.json(
        {
          error: "Browser setup error. Please run 'npx playwright install chromium'",
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Content analysis failed",
        details: error.message || "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}
