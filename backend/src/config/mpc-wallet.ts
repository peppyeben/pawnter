import path from "path";
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";

const filePath = path.resolve(__dirname, "../../config/cdp_api_key.json");
console.log("filePath: ", filePath);

let coinbase = Coinbase.configureFromJson({
    filePath,
});

async function createMPCWallet() {
    // Create a Wallet
    let wallet = await Wallet.create();
    console.log(`Wallet successfully created: `, wallet.toString());

    // wallet.createPayloadSignature

    // Wallets come with a single default Address, accessible via getDefaultAddress:
    let address = await wallet.getDefaultAddress();
    let canSign = await wallet.canSign();
    console.log(`Default address for the wallet: `, address.toString());
    console.log(`Can sign: `, canSign);
}

createMPCWallet()
    .then((r) => console.log("done"))
    .catch((e) => console.error(e));
