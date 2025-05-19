// components/dashboard/WasteLogForm.jsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

// ... (formSchema and options remain the same) ...
const formSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  wasteType: z.string().min(1, { message: "Waste type is required." }),
  quantity: z.coerce.number().positive({ message: "Quantity must be a positive number." }),
  unit: z.string().min(1, { message: "Unit is required." }),
  description: z.string().optional(),
  recycledAt: z.string().optional(),
});

const wasteTypeOptions = ["Plastic", "Paper", "Glass", "Organic", "E-waste", "Metal", "Textiles", "Other"];
const unitOptions = ["kg", "items", "liters", "bags"];


// Ensure the prop name here matches how you use it in LogWastePage.jsx
export default function WasteLogForm({ onSubmitAction, initialData = null }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      wasteType: "",
      quantity: "", // Keep as string for input, Zod will coerce
      unit: "kg",
      description: "",
      recycledAt: "",
    },
  });

  async function handleFormSubmit(values) {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage("");
    try {
      //  Ensure this matches the prop name used when rendering <WasteLogForm />
      //  If LogWastePage.jsx uses <WasteLogForm onSubmitAction={logWaste} />, then this is correct.
      const result = await onSubmitAction(values); // <--- MAKE SURE THIS LINE USES THE CORRECT PROP NAME

      if (result?.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || "Waste logged successfully!");
        form.reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result?.error || "Failed to log waste. Please try again.");
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage("An unexpected error occurred. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "Edit Waste Log" : "Log New Waste"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* ... FormFields ... (no change here needed) */}
             <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Recycling</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wasteType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Waste</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a waste type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wasteTypeOptions.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="e.g., 2.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitOptions.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Mixed plastic bottles, old newspapers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recycledAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recycled At (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Local community center, GreenWay Recyclers" {...field} />
                      </FormControl>
                      <FormDescription>
                        Name or location of the recycling facility/point.
                      </FormDescription>
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
              {isSubmitting ? "Submitting..." : (initialData ? "Update Log" : "Log Waste")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}