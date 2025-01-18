export default function PageDescription({
    name,
    caption,
}: {
    name: string;
    caption: string;
}) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-primary-foreground font-semibold text-2xl">
                {name}
            </p>
            <p className="text-foreground">{caption}</p>
        </div>
    );
}
