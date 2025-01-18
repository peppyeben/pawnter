export interface MyBets {
    name: string;
    status: "Active" | "Won" | "Lost";
    outcome: string;
    bet_amount: number;
    potential_winnings: number;
    deadline: string;
    odds: number;
}

export const my_bets: MyBets[] = [
    {
        name: "NBA Finals: Lakers vs Celtics",
        status: "Active",
        outcome: "Lakers",
        bet_amount: 0.18,
        potential_winnings: 1.4,
        deadline: "Deadline: December 15, 2024",
        odds: 1.8,
    },
    {
        name: "NBA Finals: Lakers vs Celtics",
        status: "Won",
        outcome: "Lakers",
        bet_amount: 0.18,
        potential_winnings: 1.4,
        deadline: "Deadline: December 15, 2024",
        odds: 1.8,
    },
    {
        name: "NBA Finals: Lakers vs Celtics",
        status: "Lost",
        outcome: "Lakers",
        bet_amount: 0.18,
        potential_winnings: 1.4,
        deadline: "Deadline: December 15, 2024",
        odds: 1.8,
    },
];
