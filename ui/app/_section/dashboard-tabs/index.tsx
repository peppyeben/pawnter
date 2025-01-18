import AllTab from "./all";
import SectionTabs from "@/components/custom/section-tab";

export default function DashoardTabs() {
    return <SectionTabs tabTriggers={tabTriggers} tabContents={tabContents} />;
}

const tabContents: TabContents[] = [
    { value: "all", component: <AllTab page="dashboard" /> },
    { value: "new", component: <AllTab page="dashboard" /> },
    { value: "sport", component: <AllTab page="dashboard" /> },
    { value: "election", component: <AllTab page="dashboard" /> },
    { value: "politics", component: <AllTab page="dashboard" /> },
    { value: "crypto", component: <AllTab page="dashboard" /> },
];

const tabTriggers: string[] = [
    "All",
    "New",
    "Sport",
    "Election",
    "Politics",
    "Crypto",
];

interface TabContents {
    value: string;
    component: React.ReactElement;
}
