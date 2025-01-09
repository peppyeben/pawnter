import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MarketsTabs() {
    return (
        <Tabs defaultValue="active-bets" className="w-full flex flex-col gap-6">
            <TabsList className="flex justify-start gap-8 bg-transparent p-0">
                {tabTriggers.map((item: TabTriggers) => (
                    <TabsTrigger
                        key={item.value}
                        value={item.value}
                        className="py-3 px-2 text-xs text-foreground font-semibold bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary-foreground data-[state=active]:bg-grey-50 data-[state=active]:border-b-2 border-placeholder rounded-[8px]"
                    >
                        {item.name}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="all">Change your password here.</TabsContent>
            <TabsContent value="password">
                Change your password here.
            </TabsContent>
        </Tabs>
    );
}

const tabTriggers: TabTriggers[] = [
    { name: "Active Bets", value: "active-bets" },
    { name: "Starting Soon", value: "starting-soon" },
    { name: "Ending Soon", value: "ending-soon" },
    { name: "Breaking News", value: "breaking-news" },
];

interface TabTriggers {
    name: string;
    value: string;
}
