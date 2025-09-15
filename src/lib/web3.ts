import crypto from "crypto";

// Make a SHA-256 hash of the report string
function generateReportHash(report: string) {
    return crypto.createHash("sha256").update(report).digest("hex");
}

// Example usage
const report = JSON.stringify({
    score: 92,
    title: "My SEO Analysis",
    keywords: ["Next.js", "SEO", "Avalanche"],
});

export const hash = generateReportHash(report);