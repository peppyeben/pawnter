import SectionTabs from "@/components/custom/section-tab";
import AllBetsTab from "./sections/all-bets-tab";
import PageDescription from "@/components/custom/page-description";

export default function MyBetsPage() {
    return (
        <section className="w-full flex flex-col justify-center gap-8">
            <PageDescription
                name="My Bets"
                caption="Track your prediction market bets and outcomes"
            />

            <SectionTabs tabTriggers={tabTriggers} tabContents={tabContents} />
        </section>
    );
}

const tabTriggers: string[] = ["All", "Active", "Resolved"];

const tabContents: TabContents[] = [
    {
        value: "all",
        component: <AllBetsTab />,
    },
    {
        value: "active",
        component: <AllBetsTab />,
    },
    {
        value: "resolved",
        component: <AllBetsTab />,
    },
];

interface TabContents {
    value: string;
    component: React.ReactElement;
}
