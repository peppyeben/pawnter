import Image from "next/image";
import { Input } from "../ui/input";

export default function SearchInput({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) {
  return (
    <div
      className={
        className
          ? className
          : `flex items-center w-[473px] border border-stroke py-2 pl-4 pr-2 rounded-full`
      }
    >
      <Input
        spellCheck={false}
        placeholder={placeholder ? placeholder : "Search markets"}
        className="text-xs font-medium border-none h-full focus-visible:ring-0 focus-visible:ring-none p-0 shadow-none"
      />

      <div className="flex items-center justify-center rounded-full bg-grey-50 w-8 h-6">
        <Image
          src={`/nav/search.png`}
          alt="Magnifying Glass"
          width={16}
          height={16}
        />
      </div>
    </div>
  );
}
