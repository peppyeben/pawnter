import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/custom/search-input";

export default function NavSection() {
  return (
    <section className="w-full flex justify-end items-end gap-16">
      <SearchInput />

      <div className="flex items-center gap-8">
        <Button variant={`ghost`}>
          <Image
            src={`/nav/BellSimple.png`}
            alt="Bell"
            width={24}
            height={24}
          />
        </Button>
        <div className="flex items-center gap-4">
          <Button
            variant={`outline`}
            className="py-2 px-5 w-[118px] h-10 font-bold rounded-xl"
          >
            + Create
          </Button>

          <Button
            variant={`black`}
            className="py-2 px-8 w-[128px] h-10 font-bold rounded-xl"
          >
            Connect
          </Button>
        </div>
      </div>
    </section>
  );
}
