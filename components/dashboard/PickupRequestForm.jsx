// components/dashboard/PickupRequestForm.jsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"; // For waste types
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// Define available waste types - these could come from a config or DB later
const availableWasteTypes = [
    { id: "paper", label: "Paper & Cardboard" },
    { id: "plastic", label: "Plastics" },
    { id: "glass", label: "Glass" },
    { id: "metal", label: "Metals (Cans)" },
    { id: "ewaste", label: "E-waste (Small electronics)" },
    { id: "organic", label: "Organic (Garden waste - if applicable)" },
];

const formSchema = z.object({
    address: z.string().min(5, { message: "Full address is required." }),
    city: z.string().min(2, { message: "City is required." }),
    postalCode: z.string().min(3, { message: "Postal code is required." }), // Basic validation
    contactNumber: z.string().min(7, { message: "A valid contact number is required." }), // Basic validation
    wasteTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one waste type.",
    }),
    preferredDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Preferred date is required.",
    }),
    userNotes: z.string().max(500, { message: "Notes cannot exceed 500 characters." }).optional(),
});

export default function PickupRequestForm({ onSubmitAction, initialData = null }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            address: "",
            city: "",
            postalCode: "",
            contactNumber: "",
            wasteTypes: [], // Initialize as empty array for checkboxes
            preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 3 days from now
            userNotes: "",
        },
    });

    async function handleFormSubmit(values) {
        setIsSubmitting(true);
        setSubmitStatus(null);
        setSubmitMessage("");
        try {
            const result = await onSubmitAction(values);
            if (result?.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message || "Pickup requested successfully!");
                form.reset();
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result?.error || "Failed to request pickup. Please try again.");
            }
        } catch (error) {
            setSubmitStatus('error');
            setSubmitMessage("An unexpected error occurred. Please try again.");
            console.error("Pickup form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{initialData ? "Edit Pickup Request" : "Schedule New Waste Pickup"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <FormControl><Input placeholder="e.g., 123 Main St, Apt 4B" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input placeholder="e.g., Anytown" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="postalCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Postal Code</FormLabel>
                                        <FormControl><Input placeholder="e.g., 90210" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl><Input type="tel" placeholder="e.g., (555) 123-4567" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="preferredDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Preferred Pickup Date</FormLabel>
                                    <FormControl><Input type="date" {...field} /></FormControl>
                                    <FormDescription>We'll try our best to accommodate this date.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Waste Types to be Picked Up</FormLabel>
                            <FormDescription>Select all that apply.</FormDescription>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 pt-2">
                                {availableWasteTypes.map((item) => (
                                    <FormField
                                        key={item.id}
                                        control={form.control}
                                        name="wasteTypes"
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(item.label)} // Use item.label or item.id as value
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...(field.value || []), item.label])
                                                                    : field.onChange(
                                                                        (field.value || []).filter(
                                                                            (value) => value !== item.label
                                                                        )
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal text-sm">
                                                        {item.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage className="pt-1">{form.formState.errors.wasteTypes?.message}</FormMessage>
                        </FormItem>


                        <FormField
                            control={form.control}
                            name="userNotes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Additional Notes (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g., Items will be left by the green bin, please call upon arrival." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitStatus && (
                            <div className={`p-3 rounded-md text-sm ${
                                submitStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                            >
                                {submitMessage}
                            </div>
                        )}

                        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                            {isSubmitting ? "Submitting Request..." : (initialData ? "Update Request" : "Request Pickup")}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}