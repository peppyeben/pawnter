import Image from "next/image";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function MarketCard() {
    return (
        <div className="flex flex-col w-[350px] bg-background border border-stroke p-4 rounded-[20px] gap-6">
            <div className="flex flex-col gap-5">
                <div className="flex w-full justify-between">
                    <p className="text-sm leading-[18px] font-medium underline">
                        Crypto
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Image src={``} alt="Time" width={16} height={16} />

                            <p className="text-xs text-primary-foreground">
                                2d 8h left
                            </p>
                        </div>

                        <Image src={``} alt="Up-Trend" width={16} height={16} />
                    </div>
                </div>

                <Image
                    src={``}
                    alt="Preview"
                    width={318}
                    height={80}
                    className="rounded-[8px]"
                />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="font-medium text-primary-foreground"></p>
                        <p className="text-xs text-foreground"></p>
                    </div>

                    <div className="flex w-full justify-between">
                        <Prediction type="pool" price={512340} />
                        <Prediction type="outcome" outcomes={outcomes} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <SelectOutcome />

                <Button
                    variant={`black`}
                    className="h-10 w-full py-2 px-4 rounded-xl"
                >
                    Place Bet
                </Button>

                <p className="text-xs text-foreground"></p>
            </div>
        </div>
    );
}

function Prediction({ type, price, outcomes }: Prediction) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-[10px] text-foreground">
                {type === "pool" ? "Total Pool" : "Outcomes"}
            </p>

            {price && (
                <p className="text-sm font-bold text-primary-foreground">
                    {price}
                </p>
            )}

            {outcomes && (
                <div className="flex items-center gap-2">
                    {outcomes.map((item: string) => (
                        <Button
                            variant={`outline`}
                            className="py-0.5 px-3 border-stroke rounded-[20px]"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SelectOutcome() {
    return (
        <Select>
            <SelectTrigger className="w-full h-10 text-foreground rounded-xl px-6 py-2">
                <SelectValue
                    placeholder="Select Outcome"
                    className="text-sm font-bold"
                />
            </SelectTrigger>
            <SelectContent>
                {outcomes.map((item: string) => (
                    <SelectItem key={item} value={item}>
                        {item}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

interface Prediction {
    type: "pool" | "outcome";
    price?: number;
    outcomes?: string[];
}

const outcomes: string[] = ["yes", "no"];
