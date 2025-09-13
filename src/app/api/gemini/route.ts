import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Get API key from environment variables
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            console.error('Missing Google AI API key');
            return NextResponse.json(
                { error: 'Server configuration error: Missing API key' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { url, calculatedScores, ...contentData } = body;

        const reportData = {
            url,
            ...contentData,
            performance: "N/A (Rate Limited)",
            seoScore: calculatedScores ? Math.round(calculatedScores.seo * 100) : "N/A (Rate Limited)",
            accessibility: calculatedScores ? Math.round(calculatedScores.accessibility * 100) : "N/A (Rate Limited)",
            bestPractices: calculatedScores ? Math.round(calculatedScores.bestPractices * 100) : "N/A (Rate Limited)",
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
            geminiResponse: null,
        };

        // Compose the Gemini prompt as a single string
        const prompt = `Analyze this SEO report for the URL ${url} and list:
1. Issues affecting SEO and their severity.
2. Recommended modifications (step-by-step).
3. Insights or opportunities for improvement.

Report details as JSON:
${JSON.stringify(reportData, null, 2)}

Return your answer ONLY as JSON with the following structure:
{
  "issues": [{"description": string, "severity": "low|medium|high"}],
  "modifications": [string],
  "insights": [string]
}`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API error:', errorText);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Raw Gemini API response:', JSON.stringify(result, null, 2));

        // Define response type for better type safety
        interface GeminiResponse {
            candidates?: Array<{
                content: {
                    parts?: Array<{ text: string }>;
                    text?: string;
                };
            }>;
            text?: string;
            choices?: Array<{
                text?: string;
                message?: {
                    content: string;
                };
            }>;
        }

        // Helper function to extract text from different response formats
        const extractGeneratedText = (response: GeminiResponse): string | null => {
            // Try different response formats
            if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
                return response.candidates[0].content.parts[0].text;
            }
            if (response.candidates?.[0]?.content?.text) {
                return response.candidates[0].content.text;
            }
            if (response.text) {
                return response.text;
            }
            if (response.choices?.[0]?.text) {
                return response.choices[0].text;
            }
            if (response.choices?.[0]?.message?.content) {
                return response.choices[0].message.content;
            }
            return null;
        };

        // Extract the generated text
        const generatedText = extractGeneratedText(result);
        
        if (!generatedText) {
            console.error('No generated text in response. Response structure:', JSON.stringify(result, null, 2));
            throw new Error('No generated content in the API response');
        }

        console.log('Generated text:', generatedText);

        // Clean and parse the response
        try {
            let parsedData;
            
            // Try to parse directly as JSON first
            try {
                parsedData = JSON.parse(generatedText.trim());
            } catch {
                // If direct parse fails, try to extract JSON from markdown
                console.log('Direct JSON parse failed, trying to extract from markdown...');
                
                // Try to extract JSON from markdown code blocks
                const jsonMatch = generatedText.match(/```(?:json)?\n([\s\S]*?)\n```/);
                let jsonString = jsonMatch && jsonMatch[1] 
                    ? jsonMatch[1].trim() 
                    : generatedText.trim();
                
                // Remove any remaining markdown code block markers
                jsonString = jsonString.replace(/^```(?:json)?|```$/g, '').trim();
                
                // Parse the cleaned JSON
                parsedData = JSON.parse(jsonString);
            }
            
            // Ensure the response has the expected structure
            if (!parsedData.issues || !parsedData.modifications || !parsedData.insights) {
                console.error('Invalid response structure:', parsedData);
                throw new Error('Response is missing required fields');
            }
            
            // Transform the data to match the frontend's expected format
            const responseData = {
                issues: Array.isArray(parsedData.issues) ? parsedData.issues : [],
                modifications: Array.isArray(parsedData.modifications) ? parsedData.modifications : [],
                insights: Array.isArray(parsedData.insights) ? parsedData.insights : []
            };
            
            console.log('Sending response:', JSON.stringify(responseData, null, 2));
            
            return NextResponse.json({
                success: true,
                data: responseData
            });
        } catch (error) {
            console.error('Error processing response:', error);
            return NextResponse.json({
                success: false,
                error: 'Failed to process API response',
                details: error instanceof Error ? error.message : 'Unknown error',
                rawResponse: generatedText || 'No generated text'
            }, { status: 500 });
        }
    } catch (error: unknown) {
        const err = error as Error;
        console.error("Gemini API request failed:", error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch suggestions from Gemini',
            details: err.message || 'Unknown error occurred'
        }, { status: 500 });
    }
}