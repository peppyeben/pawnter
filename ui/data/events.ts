export interface Events {
    category: "Crypto" | "Sports" | "Elections";
    time_left: string;
    trend: "up" | "down";
    image: string;
    name: string;
    caption: string;
    total_pool: number;
    outcomes: string[];
    date_created: string;
}

export const events: Events[] = [
    {
        category: "Crypto",
        time_left: "2d 8h left",
        trend: "up",
        image: "",
        name: "Bitcoin Price Prediction",
        caption: "Will Bitcoin exceed $100,000 by year end?",
        total_pool: 512340,
        outcomes: ["Yes - 1.5", "No - 2.7"],
        date_created: "Sunday, 20:00 GMT",
    },
    {
        category: "Crypto",
        time_left: "2d 8h left",
        trend: "up",
        image: "",
        name: "Bitcoin Price Prediction",
        caption: "Will Bitcoin exceed $100,000 by year end?",
        total_pool: 512340,
        outcomes: ["Yes - 1.5", "No - 2.7"],
        date_created: "Sunday, 20:00 GMT",
    },
    {
        category: "Crypto",
        time_left: "2d 8h left",
        trend: "up",
        image: "",
        name: "Bitcoin Price Prediction",
        caption: "Will Bitcoin exceed $100,000 by year end?",
        total_pool: 512340,
        outcomes: ["Yes - 1.5", "No - 2.7"],
        date_created: "Sunday, 20:00 GMT",
    },
];
