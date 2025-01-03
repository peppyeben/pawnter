import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";

// Input schema for team extraction
export const TeamExtractionInput = z.object({
    matchDescription: z
        .string()
        .describe("A string describing a match or bet scenario"),
});

// Team extraction function using Claude
async function extractTeams(
    wallet: any,
    args: z.infer<typeof TeamExtractionInput>
): Promise<string> {
    // Initialize Anthropic client (ensure proper environment setup)
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    // Extract matchDescription from args
    const { matchDescription } = args;

    // Comprehensive prompt for team extraction
    const prompt = `You are an expert in football team name identification and correction. 

        Your task is to extract team names from a given text, with a critical focus on intelligently correcting potential misspellings or ambiguous references.

        Key Guidelines:
        - Strictly use the provided team database for reference
        - Identify all possible team names in the input text
        - Correct misspellings by cross-referencing the database
        - Prioritize context and linguistic similarity
        - Be confident and precise in your corrections

        Rules for Correction:
        - Check for exact matches first
        - If no exact match, look for similar names within the same leagues
        - Consider alternative names and common misspellings listed in the database
        - Preference should be given to teams in major leagues

        Examples to demonstrate your capability:

        1. Input: "Will Atlanta beat Lazio to continue their win streak?"
        Correct Output: ["Atalanta", "Lazio"]
        Reasoning: "Atlanta" is a clear misspelling of Atalanta, a known Italian football team in the database

        2. Input: "Can Real Madird defeat Barcelona this season?"
        Correct Output: ["Real Madrid", "Barcelona"]
        Reasoning: Corrected misspelling using the comprehensive team database

        3. Input: "What will be the result of Manchster City vs Leicester?"
        Correct Output: ["Manchester City", "Leicester City"]
        Reasoning: Corrected spelling errors using database references

        Now, please extract and correct team names from this text: ${matchDescription}

        Respond ONLY with a JSON array of corrected team names.`;

    try {
        // Make API call to Claude
        const response = await anthropic.messages.create({
            model: "claude-3-5-haiku-latest",
            max_tokens: 300,
            messages: [{ role: "user", content: prompt }],
        });

        const responseText = response.content
            .filter((block) => block.type === "text")
            .map((block) => (block as Anthropic.TextBlock).text)
            .join("\n");

        try {
            // Attempt to parse as JSON
            const teams = JSON.parse(responseText);

            // Validate it's an array of strings
            if (
                Array.isArray(teams) &&
                teams.every((team) => typeof team === "string")
            ) {
                // Convert array to comma-separated string
                return teams.join(", ");
            }
        } catch (parseError) {
            // If JSON parsing fails, try to extract teams manually
            const teamMatches = responseText.match(/["']([^"']+)["']/g);
            if (teamMatches) {
                // Convert matches to comma-separated string
                return teamMatches
                    .map((team) => team.replace(/['"]/g, ""))
                    .join(", ");
            }
        }

        // Fallback if no teams found
        return "";
    } catch (error) {
        console.error("Team extraction error:", error);
        return "";
    }
}

export { extractTeams };
