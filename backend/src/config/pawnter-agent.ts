import path from "path";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { ChatAnthropic } from "@langchain/anthropic";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { CdpTool } from "@coinbase/cdp-langchain";

import * as dotenv from "dotenv";
import * as fs from "fs";
import { HumanMessage } from "@langchain/core/messages";
import {
    extractTeams,
    TeamExtractionInput,
} from "./capabilities/extract-teams";
import { EventSearchInput, searchEvents } from "./capabilities/get-team-events";
import {
    resolveMarket,
    ResolveMarketInput,
} from "./capabilities/resolve-market-on-oracle";

dotenv.config();

interface MatchResult {
    outcome: string;
    reasoning: string;
}

// Configure a file to persist the agent's CDP MPC Wallet Data
// const WALLET_DATA_FILE = "wallet_data.txt";
const WALLET_DATA_PATH = path.resolve(
    __dirname,
    "../../config/wallet_data.txt"
);

/**
 * Initialize the agent with CDP AgentKit
 *
 * @returns Agent executor and config
 */
async function initializeAgent() {
    // Initialize LLM

    const model = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY as string,
        model: "claude-3-haiku-20240307",
    });

    let walletDataStr: string | null = null;

    // Read existing wallet data if available
    if (fs.existsSync(WALLET_DATA_PATH)) {
        try {
            walletDataStr = fs.readFileSync(WALLET_DATA_PATH, "utf8");
        } catch (error) {
            console.error("Error reading wallet data:", error);
            // Continue without wallet data
        }
    }

    // Configure CDP AgentKit
    const config = {
        cdpWalletData: walletDataStr || undefined,
        networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize CDP AgentKit
    const agentkit = await CdpAgentkit.configureWithWallet(config);

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    const extractTeamsTool = new CdpTool(
        {
            name: "extract_team",
            description:
                "Extracts team names from a match description, with intelligent name recognition. " +
                "Handles slight misspellings and variations in team names using a comprehensive team database.",
            argsSchema: TeamExtractionInput,
            func: extractTeams,
        },
        agentkit
    );

    const getTeamsEventTool = new CdpTool(
        {
            name: "get_team_event",
            description: "Get event details for a given team matchup.",
            argsSchema: EventSearchInput,
            func: searchEvents,
        },
        agentkit
    );

    const resolveMarketTool = new CdpTool(
        {
            name: "resolve_market_oracle",
            description: "Resolve a market via oracle",
            argsSchema: ResolveMarketInput,
            func: resolveMarket,
        },
        agentkit
    );

    tools.push(extractTeamsTool);
    tools.push(getTeamsEventTool);
    tools.push(resolveMarketTool);

    const agent = createReactAgent({
        llm: model,
        tools,
    });

    // Save wallet data
    const exportedWallet = await agentkit.exportWallet();
    fs.writeFileSync(WALLET_DATA_PATH, exportedWallet);

    return {
        agent,
    };
}

initializeAgent()
    .then(async (r) => {
        const { agent } = r;

        const query = "What will be the outcome between West Hm vs Livrpol";
        const outcomes = ["West Ham", "Liverpool", "Draw"];
        const betDeadline = 1735485300;
        const resolutionStartTime = 1735502700;

        const result = await agent.invoke({
            messages: [
                new HumanMessage(
                    `Given ${query}, your job is to extract the two teams from the query using the extract_team tool.
                    You should return [teamOne, teamTwo] where teamOne and teamTwo are the names of the two teams in the query.
                    pass the return value which is an array and also the ${betDeadline} and ${resolutionStartTime} to the get_team_event tool.
                    
                    if no event is found, return {outcome: null, reasoning}.
                    
                    You'll have to use your intelligent capability to determine which of the comma separated ${outcomes.join(
                        ","
                    )} best fits the ${query}.
                    STRICT: You're not to make a prediction, a prediction was made (the query), your task is to get the result from the get_team_event and determine which (outcomes) fit
                    
                    CORE RESOLUTION RULES:
                    1. WIN Condition: Team with MORE goals wins
                    2. LOSE Condition: Team with FEWER goals loses
                    3. DRAW Condition: Exactly EQUAL goals
                    4. CLEAN SHEET: Team concedes ZERO goals
                    5. BOTH TEAMS SCORE: Each team scores AT LEAST ONE goal

                    OVER/UNDER GOALS RESOLUTION:
                    - TOTAL GOALS = teamA Goals + teamB Goals
                    - CALCULATE BY SUMMING BOTH TEAM'S GOALS
                    - "Over X.5" means TOTAL GOALS STRICTLY GREATER than X
                    - "Under X.5" means TOTAL GOALS STRICTLY LESS than X
                    
                    STRICT OUTPUT FORMAT:
                    {
                    "outcome": "Exact matched outcome from comma separated ${outcomes.join(
                        ","
                    )}",
                    "reasoning": "Precise numerical explanation DIRECTLY referencing team names and goals"
                    }                    

                    ABSOLUTE REQUIREMENTS:
                    - 100% NUMERICAL PRECISION
                    - EXPLICIT TEAM REFERENCES
                    - UNAMBIGUOUS REASONING
                    - NO COMPUTATIONAL GUESSWORK

                    MUST NOTE:

                    NO MATTER WHAT, THE RESPONSE MUST BE: 
                    { outcome, reasoning}. THERE MUST BE NO ADDITIONAL TEXT.
                    `
                ),
            ],
        });

        const responseResult =
            result.messages[result.messages.length - 1].content;

        console.log(extractMatchResult(responseResult));
    })
    .catch((e) => console.log(e));

function extractMatchResult(text: string): MatchResult {
    // Regex to match the entire JSON-like object, capturing outcome and reasoning
    const matchResultRegex =
        /\{[^}]*"outcome"\s*:\s*"([^"]+)"[^}]*"reasoning"\s*:\s*"([^"]+)"[^}]*\}/;

    const match = text.match(matchResultRegex);

    if (!match) {
        throw new Error("Unable to parse match result");
    }

    return {
        outcome: match[1],
        reasoning: match[2],
    };
}
