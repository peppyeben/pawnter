import axios from "axios";
import * as fs from "fs/promises";
import * as path from "path";
import dns from "dns/promises";

interface League {
    strLeague: string;
    strLeagueAlternate?: string;
}

interface Team {
    shortName: string;
    fullName: string;
    alternateName: string;
}

const TOP_SOCCER_COUNTRIES = [
    "England",
    "Spain",
    "Germany",
    "Italy",
    "France",
    "Portugal",
    "Netherlands",
    "Belgium",
    "Russia",
    "Turkey",
    "Ukraine",
    "Scotland",
    "Switzerland",
    "Austria",
    "Croatia",
    "Serbia",
    "Czech Republic",
    "Poland",
    "Romania",
    "Greece",
    "Brazil",
    "Argentina",
    "Mexico",
    "United States",
    "Japan",
    "South Korea",
    "China",
    "Saudi Arabia",
    "United Arab Emirates",
    "Australia",
    "Israel",
    "Denmark",
    "Norway",
    "Sweden",
    "Finland",
    "Iceland",
];

class SoccerTeamDataCollector {
    private readonly BASE_URLS = [
        "https://www.thesportsdb.com/api/v1/json/3",
        "https://thesportsdb.com/api/v1/json/3",
    ];
    private requestCount = 0;
    private readonly MAX_REQUESTS_PER_MINUTE = 80;
    private currentUrlIndex = 0;

    private async checkInternetConnection(): Promise<boolean> {
        try {
            await dns.lookup("www.thesportsdb.com");
            return true;
        } catch {
            console.error("DNS lookup failed. Checking alternative URLs...");
            return false;
        }
    }

    private rotateBaseUrl() {
        this.currentUrlIndex =
            (this.currentUrlIndex + 1) % this.BASE_URLS.length;
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async manageRateLimit() {
        this.requestCount++;

        if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
            console.log("Rate limit approaching. Pausing for 60 seconds...");
            await this.delay(60000);
            this.requestCount = 0;
        }
    }

    async fetchLeaguesForCountry(country: string): Promise<League[]> {
        await this.manageRateLimit();

        try {
            // Ensure internet connection before making request
            const isConnected = await this.checkInternetConnection();
            if (!isConnected) {
                throw new Error("No internet connection");
            }

            const currentBaseUrl = this.BASE_URLS[this.currentUrlIndex];
            const response = await axios.get(
                `${currentBaseUrl}/search_all_leagues.php`,
                {
                    params: {
                        c: country,
                    },
                    timeout: 10000, // 10-second timeout
                }
            );

            return (
                response.data.countries
                    ?.filter(
                        (league: League & { strSport: string }) =>
                            league.strSport === "Soccer"
                    )
                    .map((league: League) => ({
                        strLeague: league.strLeague,
                        strLeagueAlternate: league.strLeagueAlternate,
                    })) || []
            );
        } catch (error) {
            console.error(`Error fetching leagues for ${country}:`, error);

            // Rotate URL if request fails
            this.rotateBaseUrl();

            // Wait and retry
            await this.delay(2000);
            return this.fetchLeaguesForCountry(country);
        }
    }

    async fetchTeamsForLeague(leagueName: string): Promise<Team[]> {
        await this.manageRateLimit();

        try {
            const currentBaseUrl = this.BASE_URLS[this.currentUrlIndex];
            const response = await axios.get(
                `${currentBaseUrl}/search_all_teams.php`,
                {
                    params: { l: leagueName },
                    timeout: 10000, // 10-second timeout
                }
            );

            return (
                response.data.teams
                    ?.map((team: any) => ({
                        shortName: team.strTeamShort || "",
                        fullName: team.strTeam || "",
                        alternateName: team.strTeamAlternate || "",
                    }))
                    .filter((team: Team) => team.fullName) || []
            );
        } catch (error) {
            console.error(
                `Error fetching teams for league ${leagueName}:`,
                error
            );

            // Rotate URL if request fails
            this.rotateBaseUrl();

            // Wait and retry
            await this.delay(2000);
            return this.fetchTeamsForLeague(leagueName);
        }
    }

    async collectTeamData() {
        const teamsOutputDir = path.join(__dirname, "teams");
        await fs.mkdir(teamsOutputDir, { recursive: true });

        const allCountryTeams: Record<string, string[][]> = {};

        for (const country of TOP_SOCCER_COUNTRIES) {
            console.log(`Processing ${country}...`);

            const leagues = await this.fetchLeaguesForCountry(country);
            const countryTeams: string[][] = [];

            for (const league of leagues) {
                const leagueNames = [
                    league.strLeague,
                    league.strLeagueAlternate,
                ].filter(Boolean);

                for (const leagueName of leagueNames) {
                    const teams = await this.fetchTeamsForLeague(
                        leagueName ?? ""
                    );

                    if (teams.length > 0) {
                        const formattedTeams = teams.map((team) => [
                            team.shortName,
                            team.fullName,
                            team.alternateName,
                        ]);
                        countryTeams.push(...formattedTeams);
                        console.log(
                            `Found ${teams.length} teams for ${leagueName}`
                        );
                        break;
                    }
                }
            }

            if (countryTeams.length > 0) {
                allCountryTeams[country] = countryTeams;

                const countryFilePath = path.join(
                    teamsOutputDir,
                    `${country.replace(/\s+/g, "_")}_teams.json`
                );
                await fs.writeFile(
                    countryFilePath,
                    JSON.stringify(countryTeams, null, 2)
                );
            }
        }

        const allTeamsFilePath = path.join(teamsOutputDir, "all_teams.json");
        await fs.writeFile(
            allTeamsFilePath,
            JSON.stringify(allCountryTeams, null, 2)
        );

        return allCountryTeams;
    }
}

async function main() {
    const collector = new SoccerTeamDataCollector();
    try {
        await collector.collectTeamData();
        console.log("Team data collection completed successfully.");
    } catch (error) {
        console.error("Fatal error during team data collection:", error);
    }
}

main().catch(console.error);
