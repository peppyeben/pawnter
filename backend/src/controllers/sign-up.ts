import jwt from "jsonwebtoken";
import { UserPawnterAccount } from "../model/user-pawnter-account";
import * as dotenv from "dotenv";
import { createMPCWallet } from "../config/mpc-wallet";
import { asyncWrapper } from "../middleware/async";

dotenv.config();

export const pawnterSignup = asyncWrapper(async (req, res) => {
    const { user_email, user_password } = req.body;

    // Create user without seed
    const newSignUp = new UserPawnterAccount({
        user_email,
        user_password,
    });

    // Validate and save user
    await newSignUp.validate();
    await newSignUp.save();

    // Generate token
    const token = jwt.sign(
        { userPawnterID: newSignUp._id },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: "4h",
        }
    );

    const { walletSeed } = await createMPCWallet();

    // Update user with seed
    await UserPawnterAccount.findByIdAndUpdate(
        newSignUp._id,
        { user_seed: walletSeed },
        { runValidators: true }
    );

    res.status(201).json({
        token,
    });
});
