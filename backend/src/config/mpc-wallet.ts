import path from "path";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

const filePath = path.resolve(__dirname, "../../config/cdp_api_key.json");
console.log("filePath: ", filePath);

let coinbase = Coinbase.configureFromJson({
    filePath,
});

export const createMPCWallet = async () => {
    // Create a Wallet
    let wallet = await Wallet.create();

    return {
        walletSeed: wallet["seed"] as string,
    };

    // wallet.createPayloadSignature

    // Wallets come with a single default Address, accessible via getDefaultAddress:
    // let address = await wallet.getDefaultAddress();
};

export const getUserMPCWalletAddress = async (user_seed: string) => {
    const walletFromSeed = await Wallet.createWithSeed({
        seed: user_seed,
    });

    const userWalletAddress = await walletFromSeed.getDefaultAddress();

    return userWalletAddress;
};
