import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AllTab from "./all";

export default function DashoardTabs() {
    return (
        <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
            <TabsList className="flex justify-start bg-transparent p-0">
                {tabTriggers.map((item: string) => (
                    <TabsTrigger
                        key={item}
                        value={item.toLocaleLowerCase()}
                        className="py-2 px-5 text-sm text-foreground bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary-foreground data-[state=active]:bg-grey-50 data-[state=active]:border-l-2 border-stroke rounded-[8px]"
                    >
                        {item}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value="all">
                <AllTab />
            </TabsContent>
            <TabsContent value="password">
                Change your password here.
            </TabsContent>
        </Tabs>
    );
}

const tabTriggers: string[] = [
    "All",
    "New",
    "Sport",
    "Election",
    "Politics",
    "Crypto",
];
