import { getUserMPCWalletAddress } from "../config/mpc-wallet";
import { CustomAPIError } from "../errors";
import { asyncWrapper } from "../middleware/async";
import { UserPawnterAccount } from "../model/user-pawnter-account";
import * as dotenv from "dotenv";

dotenv.config();

type UserProfile = {
    user_email: string;
    user_wallet_address: any;
};

export const getUserPawnterProfile = asyncWrapper(async (req, res) => {
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

    const user_wallet_address = await getUserMPCWalletAddress(
        user_account.user_seed
    );

    const userProfile: UserProfile = {
        user_email: user_account.user_email,
        user_wallet_address: user_wallet_address,
    };

    res.status(201).json({
        userProfile,
    });
});
