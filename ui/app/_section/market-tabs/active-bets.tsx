import Image from "next/image";

export default function ActiveBetsTab() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <Image
                    src={`/nav/BellSimple.png`}
                    alt="Fire"
                    width={24}
                    height={24}
                />

                <p className="font-semibold text-foreground">Popular Events</p>
            </div>
        </div>
    );
}
