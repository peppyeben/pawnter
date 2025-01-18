import PageDescription from "@/components/custom/page-description";
import CreateForm from "./sections/create-form";

export default function CreatePage() {
    return (
        <section className="w-full flex flex-col items-center justify-center gap-8">
            <div className="w-[530px]">
                <PageDescription
                    name="Create New Market"
                    caption="Design a prediction market and let the crowd forecast the outcome"
                />
            </div>

            <CreateForm />
        </section>
    );
}
