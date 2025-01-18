import Image from "next/image";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Events } from "@/data/events";
import { FormatPrice } from "@/lib/format-price";

export default function MarketCard({
    category,
    time_left,
    trend,
    image,
    name,
    caption,
    total_pool,
    outcomes,
    date_created,
}: Events) {
    return (
        <div className="flex flex-col w-[350px] bg-background border border-stroke p-4 rounded-[20px] gap-6">
            <div className="flex flex-col gap-5">
                <div className="flex w-full justify-between">
                    <p className="text-sm leading-[18px] font-medium underline">
                        {category}
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Image src={``} alt="Time" width={16} height={16} />

                            <p className="text-xs text-primary-foreground">
                                {time_left}
                            </p>
                        </div>

                        <Image src={``} alt="Up-Trend" width={16} height={16} />
                    </div>
                </div>

                <Image
                    src={image}
                    alt="Preview"
                    width={318}
                    height={80}
                    className="rounded-[8px]"
                />

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <p className="font-medium text-primary-foreground">
                            {name}
                        </p>
                        <p className="text-xs text-foreground">{caption}</p>
                    </div>

                    <div className="flex w-full justify-between">
                        <Prediction type="pool" price={total_pool} />
                        <Prediction type="outcome" outcomes={outcomes} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-2">
                <SelectOutcome outcomes={outcomes} />

                <Button
                    variant={`black`}
                    className="h-10 w-full py-2 px-4 rounded-xl"
                >
                    Place Bet
                </Button>

                <p className="text-xs text-foreground">{date_created}</p>
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
                    {FormatPrice(price)}
                </p>
            )}

            {outcomes && (
                <div className="flex items-center gap-2">
                    {outcomes.map((item: string) => (
                        <Button
                            variant={`outline`}
                            className="py-0.5 px-3 border-stroke rounded-[20px] text-xs h-fit"
                        >
                            {item}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SelectOutcome({ outcomes }: { outcomes: string[] }) {
    return (
        <Select>
            <SelectTrigger className="w-full h-10 text-foreground rounded-xl px-6 py-2 bg-grey-100">
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
