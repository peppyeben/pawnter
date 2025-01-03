import { z } from "zod";
import teamDatabase from "../../utils/teams/all_teams.json";

// Input schema for event search
export const EventSearchInput = z.object({
    teams: z
        .array(z.string())
        .length(2)
        .describe("An array of two team names to search for events"),
    betDeadline: z
        .number()
        .optional()
        .describe("Bet deadline timestamp in seconds"),
    resolutionStartTime: z
        .number()
        .optional()
        .describe("Resolution start timestamp in seconds"),
});

// Flatten the team database for easier searching
const flattenedTeamDatabase = (() => {
    const teams: any = {};
    Object.values(teamDatabase).forEach((league) => {
        league.forEach((teamEntry) => {
            // Add all variations of the team name as keys
            teamEntry.forEach((teamName) => {
                teams[teamName.toLowerCase()] = teamEntry[1]; // Use standard name
            });
        });
    });
    return teams;
})();

// Convert timestamp to seconds since epoch
function timestampToSeconds(timestamp: string): number {
    return Math.floor(new Date(timestamp).getTime() / 1000);
}

// Try to normalize team name using the database
function normalizeTeamName(inputName: string): string {
    const normalizedName = inputName.toLowerCase();
    return flattenedTeamDatabase[normalizedName] || inputName;
}

// Event search function
async function searchEvents(
    wallet: any,
    args: z.infer<typeof EventSearchInput>
): Promise<string> {
    const { teams, betDeadline = 0, resolutionStartTime = Infinity } = args;
    const [teamOne, teamTwo] = teams;

    // Normalize team names
    const normalizedTeamOne = normalizeTeamName(teamOne);
    const normalizedTeamTwo = normalizeTeamName(teamTwo);

    // Try all possible combinations of team names
    const teamCombinations = [
        `${normalizedTeamOne} vs ${normalizedTeamTwo}`,
        `${normalizedTeamTwo} vs ${normalizedTeamOne}`,
        `${teamOne} vs ${teamTwo}`,
        `${teamTwo} vs ${teamOne}`,
    ];

    const allEvents: any[] = [];

    for (const matchup of teamCombinations) {
        try {
            const encodedMatchup = encodeURIComponent(matchup);
            const url = `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodedMatchup}&s=${getCurrentSeason()}`;

            const response = await fetch(url);
            const data = await response.json();

            // If events found, add them to the collection
            if (data.event && data.event.length > 0) {
                allEvents.push(...data.event);
            }
        } catch (error) {
            console.error(`Error searching for ${matchup}:`, error);
        }
    }

    // Find a single event within the time window
    const validEvent = allEvents.find((event: any) => {
        if (!event.strTimestamp) return false;

        const eventTimestamp = timestampToSeconds(event.strTimestamp);

        return (
            eventTimestamp >= betDeadline &&
            eventTimestamp <= resolutionStartTime
        );
    });

    // If a valid event is found, return it
    if (validEvent) {
        return JSON.stringify(validEvent);
    }

    // If no events found after trying all combinations
    return "No events found";
}

function getCurrentSeason(): string {
    const now = new Date();
    const currentYear = now.getFullYear();
    const month = now.getMonth();

    // Football/soccer season typically spans two calendar years
    const seasonStartYear = month >= 7 ? currentYear : currentYear - 1;
    return `${seasonStartYear}-${seasonStartYear + 1}`;
}

export { searchEvents };
