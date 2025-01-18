import SectionTabs from "@/components/custom/section-tab";
import AllTab from "../_section/dashboard-tabs/all";
import MarketsTabs from "./section/market-tabs";

export default function Markets() {
    return (
        <section className="min-w-full flex justify-center gap-16">
            <SectionTabs tabTriggers={tabTriggers} tabContents={tabContents} />
        </section>
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

const tabContents: TabContents[] = [
    {
        value: "all",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
    {
        value: "new",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
    {
        value: "sport",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
    {
        value: "election",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
    {
        value: "politics",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
    {
        value: "crypto",
        component: (
            <AllTab page="markets">
                <MarketsTabs />
            </AllTab>
        ),
    },
];

interface TabContents {
    value: string;
    component: React.ReactElement;
}
