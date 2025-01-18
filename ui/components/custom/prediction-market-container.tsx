import SearchInput from "./search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PredictionMarketContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="flex flex-col gap-2">
                <p className="text-2xl font-semibold text-primary-foreground">
                    Prediction Markets
                </p>

                <div className="flex w-full gap-3 items-center">
                    <SearchInput className="flex flex-row-reverse gap-2 py-2 px-3 bg-grey-50 h-9 w-[650px] rounded-full" />

                    <SortSelect />
                </div>
            </div>

            {children}
        </>
    );
}

function SortSelect() {
    return (
        <Select>
            <SelectTrigger className="w-[180px] py-1.5 px-3 bg-grey-50 rounded-[20px] text-xs text-primary-foreground data-[state=closed]:border-none data-[state=open]:bg-white data-[state=open]:rounded-b-none focus-visible:ring-0 transition-colors duration-300">
                <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="flex flex-col gap-3 -mt-1 rounded-t-none w-[180px] rounded-b-[20px]">
                {selctItems.map((item: SelectProps) => (
                    <SelectItem
                        key={item.name}
                        value={item.name.toLocaleLowerCase()}
                        className="flex items-center gap-2 py-0.5 text-xs text-primary-foreground"
                    >
                        {item.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

const selctItems: SelectProps[] = [
    { name: "Trending", icon: "" },
    { name: "Volume", icon: "" },
    { name: "Liquidity", icon: "" },
    { name: "Newest", icon: "" },
];

interface SelectProps {
    name: string;
    icon: string;
}
