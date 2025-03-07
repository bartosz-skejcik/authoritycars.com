"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import validator from "validator";
import { motion } from "motion/react";

const models = ["Sedan", "Crossover", "Motocykl", "ATV", "Oversized"];

const formSchema = z.object({
  telephone: z
    .string()
    .min(9, {
      message: "Telephone number must be at least 9 characters.",
    })
    .refine(validator.isMobilePhone),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  budget_from: z.string().min(1, {
    message: "Budget from is required.",
  }),
  budget_to: z.string().min(1, {
    message: "Budget to is required.",
  }),
  model: z.string({
    required_error: "Please select a model.",
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      telephone: "",
      name: "",
      budget_from: "",
      budget_to: "",
      model: "",
    },
  });

  function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      setIsSubmitting(false);
      setIsSuccess(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        form.reset();
      }, 3000);
    }, 1500);
  }

  return (
    <div className="w-full bg-black text-white">
      {/* Application Specialist Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div id="formularz" className="mb-12 text-center">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-bold tracking-tight uppercase md:text-6xl"
            >
              Aplikuj <span className="text-orange-400">już dziś!</span>
            </motion.h2>
            <motion.p
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-400"
            >
              Dostarczanie samochodów
            </motion.p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <motion.div
                          initial={{ y: 100, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Input
                            placeholder="Telefon"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <motion.div
                          initial={{ y: 100, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Input
                            placeholder="Imię i Nazwisko"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue placeholder="Model" />
                            </SelectTrigger>
                          </motion.div>
                        </FormControl>
                        <SelectContent className="">
                          {models.map((model) => (
                            <SelectItem key={model} value={model}>
                              {model}
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
                  name="budget_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <motion.div
                          initial={{ y: 100, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Input
                            placeholder="Budżet od"
                            type="number"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <motion.div
                          initial={{ y: 100, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <Input
                            inputMode="none"
                            placeholder="Budżet do"
                            type="number"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-start space-x-2">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FormField
                    control={form.control}
                    name="consent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-orange-400 data-[state=checked]:bg-orange-400 data-[state=checked]:text-black"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <p className="text-sm text-gray-300">
                            Wyrażam zgodę na przetwarzanie moich danych
                            osobowych zgodnie z{" "}
                            <Link
                              href="/privacy-policy"
                              className="text-orange-400 hover:underline"
                            >
                              Polityką Prywatności.
                            </Link>
                          </p>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end"
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className={`text-foreground w-full border border-orange-400 bg-transparent px-8 py-5 transition-colors hover:bg-orange-400 md:w-auto ${isSuccess ? "border-green-600 bg-green-600 text-white" : ""}`}
                >
                  {isSubmitting
                    ? "Sending..."
                    : isSuccess
                      ? "Sent Successfully"
                      : "Send"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
