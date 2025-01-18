"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";

const formSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }),
    description: z
        .string()
        .min(10, { message: "Description must be at least 10 characters." }),
    thumbnail: z
        .any()
        .refine((file) => file instanceof File, {
            message: "Thumbnail must be a valid file.",
        })
        .refine(
            (file) => file.size <= 5 * 1024 * 1024, // Limit to 5MB
            { message: "File size must not exceed 5MB." }
        )
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/gif"].includes(file.type),
            { message: "Only .jpg, .png, or .gif files are allowed." }
        ),
    category: z.string({
        required_error: "Please select a category.",
    }),
    oracle: z.string({
        required_error: "Please select an oracle.",
    }),
    predictions: z
        .string()
        .min(2, { message: "Prediction should be atleast 2 characters" }),
    betting_deadline: z.date({
        required_error: "A betting deadline is required.",
    }),
    resolution_deadline: z.date({
        required_error: "A resolution deadline is required.",
    }),
});

export default function CreateForm() {
    const [selectedImage, setSelectedImage] = useState<string>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const handleFileChange = (file: File | null) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        } else {
            setSelectedImage("");
        }
    };

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-[530px] space-y-6"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Market Title
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="shadcn"
                                    {...field}
                                    className="h-12 border-stroke rounded-xl py-3 px-4 text-sm text-primary-foreground"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="shadcn"
                                    {...field}
                                    className="h-32 border-stroke rounded-xl py-3 px-4 text-sm text-primary-foreground"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Market Thumbnail
                            </FormLabel>
                            <FormControl>
                                <div className="flex w-full gap-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] || null;
                                            field.onChange(file);
                                            handleFileChange(file);
                                        }}
                                        className="h-[124px] border-stroke rounded-xl py-3 px-4 text-sm text-primary-foreground"
                                    />

                                    <div className="flex flex-col items-center justify-center gap-2 bg-grey-100 w-[186px] h-[124px] rounded-2xl">
                                        <Image
                                            src={
                                                selectedImage ||
                                                "/placeholder-image.png"
                                            }
                                            alt="Preview"
                                            width={selectedImage ? 186 : 16}
                                            height={selectedImage ? 124 : 16}
                                            className={
                                                selectedImage
                                                    ? "w-full h-full rounded-2xl"
                                                    : "w-4 h-4"
                                            }
                                        />

                                        {!selectedImage && (
                                            <p className="text-[10px] text-foreground">
                                                Image Preview
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Category
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full h-12 py-1.5 px-3 border-stroke rounded-xl text-sm text-primary-foreground data-[state=open]:bg-white data-[state=open]:rounded-b-none focus-visible:ring-0 transition-colors duration-300">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="flex flex-col gap-3 -mt-1 rounded-t-none w-full rounded-b-[20px]">
                                    {categories.map((item: Categories) => (
                                        <SelectItem
                                            key={item.name}
                                            value={item.value}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="oracle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Oracle
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full h-12 py-1.5 px-3 border-stroke rounded-xl text-sm text-primary-foreground data-[state=open]:bg-white data-[state=open]:rounded-b-none focus-visible:ring-0 transition-colors duration-300">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="flex flex-col gap-3 -mt-1 rounded-t-none w-full rounded-b-[20px]">
                                    {categories.map((item: Categories) => (
                                        <SelectItem
                                            key={item.name}
                                            value={item.value}
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="predictions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-semibold text-primary-foreground">
                                Predictions
                            </FormLabel>
                            <FormControl>
                                <div className="flex flex-col gap-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input
                                            placeholder="shadcn"
                                            {...field}
                                            className="h-12 border-stroke rounded-xl py-3 px-4 text-sm text-primary-foreground"
                                        />

                                        <Input
                                            placeholder="shadcn"
                                            {...field}
                                            className="h-12 border-stroke rounded-xl py-3 px-4 text-sm text-primary-foreground"
                                        />
                                    </div>

                                    <Button className="text-xs font-semibold text-primary-foreground w-fit h-fit px-1 py-2 shadow-none bg-transparent hover:bg-transparent">
                                        Add Outcome
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}

const categories: Categories[] = [
    { value: "crypto", name: "Crypto" },
    { value: "politics", name: "Politics" },
    { value: "sports", name: "Sports" },
    { value: "elections", name: "Elections" },
    { value: "others", name: "Others" },
];

interface Categories {
    value: string;
    name: string;
}
