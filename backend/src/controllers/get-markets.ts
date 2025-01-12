import { CustomAPIError } from "../errors";
import { asyncWrapper } from "../middleware/async";
import { UserPawnterAccount } from "../model/user-pawnter-account";
import { Wallet } from "@coinbase/coinbase-sdk";
import * as dotenv from "dotenv";
import { PAWNTER_MARKET } from "../utils/abi";

dotenv.config();

export const getMarkets = asyncWrapper(async (req, res) => {
    const { market_id = null } = req.body;
    const { userPawnterID } = req;

    const user_account = await UserPawnterAccount.findById(userPawnterID);

    if (!user_account) {
        throw new CustomAPIError("User not Found", 401);
    }

    if (
        String(user_account.user_seed).trim().length < 1 ||
        user_account.user_seed == null
    ) {
        throw new CustomAPIError("User Wallet doesn't exist", 401);
    }

    const user_wallet = await Wallet.createWithSeed({
        seed: user_account.user_seed,
    });

    let marketInfo: any = null;

    if (market_id != null) {
        marketInfo = user_wallet.invokeContract({
            contractAddress: process.env.PAWNTER_MARKET_ADDRESS as string,
            method: "getMarketInfo",
            abi: PAWNTER_MARKET,
            args: [BigInt(market_id)],
        });

        console.log(marketInfo);
    } else {
        marketInfo = user_wallet.invokeContract({
            contractAddress: process.env.PAWNTER_MARKET_ADDRESS as string,
            method: "getAllMarkets",
            abi: PAWNTER_MARKET,
            args: [],
        });

        console.log(marketInfo);
    }

    console.log(marketInfo);

    res.status(201).json({});
});
