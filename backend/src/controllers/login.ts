import jwt from "jsonwebtoken";
import { CustomAPIError } from "../errors";
import { asyncWrapper } from "../middleware/async";
import { UserPawnterAccount } from "../model/user-pawnter-account";
import * as dotenv from "dotenv";

dotenv.config();

export const pawnterLogin = asyncWrapper(async (req, res) => {
    const { user_email, user_password } = req.body;

    const user_account = await UserPawnterAccount.findOne({
        user_email,
    });

    if (!user_account) {
        throw new CustomAPIError("User not Found", 401);
    }

    const isValidUserPassword = await user_account.comparePassword(
        String(user_password)
    );

    if (!isValidUserPassword) {
        throw new CustomAPIError("User Password Incorrect", 401);
    }

    const token = jwt.sign(
        { userPawnterID: user_account._id },
        process.env.JWT_SECRET_KEY as string,
        {
            expiresIn: "4h",
        }
    );

    res.status(200).json({ token });
});
