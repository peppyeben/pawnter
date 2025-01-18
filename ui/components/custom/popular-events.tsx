import Image from "next/image";
import { Events, events } from "@/data/events";
import MarketCard from "./market-card";

export default function PopularEvents() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <Image src={``} alt="Fire" width={16} height={20} />
                <p className="text-foreground font-semibold">Popular Events</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {events.map((item: Events) => (
                    <MarketCard
                        key={item.name}
                        category={item.category}
                        time_left={item.time_left}
                        trend={item.trend}
                        image={item.image}
                        name={item.name}
                        caption={item.caption}
                        total_pool={item.total_pool}
                        outcomes={item.outcomes}
                        date_created={item.date_created}
                    />
                ))}
            </div>
        </div>
    );
}
