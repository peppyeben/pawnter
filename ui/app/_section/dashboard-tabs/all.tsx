import { Button } from "@/components/ui/button";
import Image from "next/image";
import PredictionMarketContainer from "@/components/custom/prediction-market-container";
import PopularEvents from "@/components/custom/popular-events";

export default function AllTab({
    page,
    children,
}: {
    page: "dashboard" | "markets";
    children?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-6">
            <div
                className={`w-full ${
                    page === "dashboard" ? "flex" : "hidden"
                } gap-4`}
            >
                {popular_bets.map((item: PopularBets, index: number) => (
                    <PopularBetsContainer key={index}>
                        <PopularBets
                            name={item.name}
                            caption={item.caption}
                            image={item.image}
                        />
                    </PopularBetsContainer>
                ))}

                <PopularBetsContainer>
                    <div className="flex flex-col justify-between gap-2 max-w-[158px]">
                        <p className="text-lg font-medium">
                            Fund your wallet to start betting today.
                        </p>
                        <Button
                            variant={`black`}
                            className="w-fit rounded-[20px] text-xs font-semibold"
                        >
                            Connect Wallet
                        </Button>
                    </div>
                </PopularBetsContainer>
            </div>

            <PredictionMarketContainer>
                {page === "dashboard" ? <PopularEvents /> : children}
            </PredictionMarketContainer>
        </div>
    );
}

function PopularBetsContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-[350px] py-2 px-3 rounded-t-2xl rounded-b-[20px] bg-grey-50 flex justify-between">
            {children}
        </div>
    );
}

function PopularBets({ name, caption, image }: PopularBets) {
    return (
        <>
            <div className="flex flex-col h-full justify-between max-w-[158px]">
                <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-primary-foreground">
                        {name}
                    </p>
                    <p className="text-xs text-foreground">{caption}</p>
                </div>

                <Button
                    variant={`outline`}
                    className="rounded-[20px] w-fit text-xs text-primary-foreground"
                >
                    Place Bet
                </Button>
            </div>

            <Image
                src={image}
                alt={name}
                width={144}
                height={120}
                className="rounded-[8px]"
            />
        </>
    );
}

const popular_bets: PopularBets[] = [
    {
        name: "$BTC to the moon",
        caption: "Will Bitcoin hit $100k in 2024?",
        image: "",
    },
    {
        name: "Man city vs Liverpool",
        caption: "Who triumphs?",
        image: "",
    },
];

interface PopularBets {
    name: string;
    caption: string;
    image: string;
}
