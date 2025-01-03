import { Wallet, hashMessage } from "@coinbase/coinbase-sdk";
import { z } from "zod";
import { PAWNTER_ORACLE } from "../../utils/abi";
import * as dotenv from "dotenv";

dotenv.config();

// Define the input schema using Zod
export const ResolveMarketInput = z
    .object({
        outcome: z.string().describe("Agent resolved outcome"),
        marketID: z.string().describe("ID of market to resolve"),
    })
    .strip()
    .describe("Instructions for signing a blockchain message");

async function resolveMarket(
    wallet: any,
    args: z.infer<typeof ResolveMarketInput>
): Promise<string> {
    const { marketID, outcome } = args;
    // Using the correct method from Wallet interface
    const invocationResult = await wallet.invokeContract({
        contractAddress: process.env.PAWNTER_ORACLE_ADDRESS as string,
        method: "resolveBet",
        abi: PAWNTER_ORACLE,
        args: [BigInt(marketID), outcome],
    });

    console.log(invocationResult);

    return `The payload signature ${invocationResult}`;
}

export { resolveMarket };
