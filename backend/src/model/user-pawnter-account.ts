import mongoose, { Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { decrypt, encrypt } from "../utils/encrypt-decrypt";

export interface IUserPawnterAccount extends mongoose.Document {
    user_email: string;
    user_password: string;
    user_seed?: string | null;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define an interface for the model static methods (if any)
export interface UserPawnterAccountModel extends Model<IUserPawnterAccount> {
    // Add any static methods here if needed
}

const UserPawnterAccountSchema = new mongoose.Schema(
    {
        user_email: {
            type: String,
            required: [true, "Email Address is required"],
            unique: true,
            trim: true,
            lowercase: true,
            validate: [
                {
                    validator: function (value: string) {
                        return validator.isEmail(value);
                    },
                    message: "Please provide a valid email address",
                },
                {
                    validator: function (value: string) {
                        const allowedDomains = [
                            "gmail.com",
                            "yahoo.com",
                            "hotmail.com",
                        ];
                        const domain = value.split("@")[1];
                        return allowedDomains.includes(domain);
                    },
                    message:
                        "Email must be from an allowed domain (gmail, yahoo, hotmail)",
                },
            ],
            maxlength: [50, "Email address cannot exceed 50 characters"],
        },
        user_password: {
            type: String,
            required: [true, "Password required"],
            minlength: [8, "Password must be at least 8 characters long"],
            validate: [
                {
                    validator: function (value: string) {
                        // Check for at least one uppercase letter
                        const hasUpperCase = /[A-Z]/.test(value);
                        // Check for at least one lowercase letter
                        const hasLowerCase = /[a-z]/.test(value);
                        // Check for at least one number
                        const hasNumbers = /[0-9]/.test(value);
                        // Check for at least one special character
                        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
                            value
                        );

                        return (
                            hasUpperCase &&
                            hasLowerCase &&
                            hasNumbers &&
                            hasSpecialChar
                        );
                    },
                    message:
                        "Password must include uppercase, lowercase, number, and special character",
                },
            ],
        },
        user_seed: {
            type: String,
            required: false,
            validate: [
                {
                    validator: function (value: string | null) {
                        // If seed is provided, apply existing validations
                        if (value) {
                            return value.trim().length > 0;
                        }
                        return true; // Allow null/empty during initial creation
                    },
                    message: "User seed cannot be an empty string",
                },
            ],
            set: encrypt,
            get: decrypt,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
    }
);

// Pre-save middleware for password hashing
UserPawnterAccountSchema.pre("save", async function (next) {
    try {
        // Encrypt seed first if modified
        if (this.isModified("user_seed") && this.user_seed) {
            this.user_seed = encrypt(this.user_seed);
        }

        // Only hash the password if it has been modified (or is new)
        if (!this.isModified("user_password")) return next();

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password along with the salt
        this.user_password = await bcrypt.hash(this.user_password, salt);

        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password for login
UserPawnterAccountSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    return bcrypt.compare(candidatePassword, this.user_password);
};

export const UserPawnterAccount = mongoose.model<
    IUserPawnterAccount,
    UserPawnterAccountModel
>("UserPawnterAccount", UserPawnterAccountSchema);
