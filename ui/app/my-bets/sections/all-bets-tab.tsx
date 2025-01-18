import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { my_bets, MyBets } from "@/data/my-bets";
import { FormatBNB } from "@/lib/format-price";

export default function AllBetsTab() {
    return (
        <div className="w-full flex flex-col gap-4">
            {my_bets.map((item: MyBets) => (
                <BetCard
                    name={item.name}
                    status={item.status}
                    outcome={item.outcome}
                    bet_amount={item.bet_amount}
                    potential_winnings={item.potential_winnings}
                    deadline={item.deadline}
                    odds={item.odds}
                />
            ))}
        </div>
    );
}

function BetCard({
    name,
    status,
    outcome,
    bet_amount,
    potential_winnings,
    deadline,
    odds,
}: MyBets) {
    return (
        <div className="flex flex-col gap-5 p-4 rounded-xl border border-stroke">
            <div className="flex items-center justify-between w-full px-4 pb-4 border-b border-stroke">
                <p className="text-2xl font-semibold text-primary-foreground">
                    {name}
                </p>

                <Badge
                    variant={
                        status === "Active"
                            ? "active"
                            : status === "Won"
                            ? "success"
                            : "destructive"
                    }
                >
                    {status}
                </Badge>
            </div>

            <div className="w-full grid grid-cols-3 px-4 gap-6">
                <BetDetails name="Outcomes" details={outcome} />
                <BetDetails name="Bet Amount" details={FormatBNB(bet_amount)} />
                <BetDetails
                    name="Potential Winnings"
                    details={FormatBNB(potential_winnings)}
                />
            </div>

            <div className="flex w-full justify-between items-center">
                <div className="flex gap-1 items-center">
                    <Image src={``} alt="Clock" width={20} height={20} />

                    <p className="text-xs text-foreground">
                        {"Deadline: " + deadline}
                    </p>
                </div>

                <p className="font-semibold text-foreground">
                    {"Odds: " + odds}
                </p>
            </div>
        </div>
    );
}

function BetDetails({ name, details }: { name: string; details: string }) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm text-foreground">{name}</p>
            <p
                className={`font-bold ${
                    name === "Potential Winnings"
                        ? "text-success-600"
                        : "text-foreground"
                }`}
            >
                {details}
            </p>
        </div>
    );
}
