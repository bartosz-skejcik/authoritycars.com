"use client";

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
import { useSubmissionForm } from "@/hooks/use-submission-form"; // Import the hook

const models = ["Sedan", "Crossover", "Motocykl", "ATV", "Oversized"];

const formSchema = z.object({
  telephone: z
    .string()
    .min(9, {
      message: "Numer telefonu musi mieć co najmniej 9 znaków.",
    })
    .max(15, {
      message: "Numer telefonu nie może przekraczać 15 znaków.",
    })
    .refine(validator.isMobilePhone, {
      message: "Proszę podać prawidłowy numer telefonu.",
    }),
  name: z
    .string()
    .min(2, {
      message: "Imię musi mieć co najmniej 2 znaki.",
    })
    .max(50, {
      message: "Imię nie może przekraczać 50 znaków.",
    })
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, {
      message: "Imię może zawierać tylko litery i spacje.",
    }),
  budget_from: z
    .string()
    .min(1, {
      message: "Minimalna kwota budżetu jest wymagana.",
    })
    .refine((value) => !isNaN(parseFloat(value.replace(/\s/g, ""))), {
      message: "Budżet musi być prawidłową liczbą.",
    }),
  budget_to: z
    .string()
    .min(1, {
      message: "Maksymalna kwota budżetu jest wymagana.",
    })
    .refine((value) => !isNaN(parseFloat(value.replace(/\s/g, ""))), {
      message: "Budżet musi być prawidłową liczbą.",
    }),
  model: z.string().min(1, {
    message: "Model pojazdu jest wymagany.",
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Musisz zaakceptować politykę prywatności" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SubmissionFormProps {
  ref?: string;
}

export default function SubmissionForm({ ref }: SubmissionFormProps) {
  // Use the submission form hook
  const { isSubmitting, isSuccess, openStatusId, submitForm } =
    useSubmissionForm(ref);

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

  async function onSubmit(data: FormValues) {
    try {
      if (parseInt(data.budget_from) > parseInt(data.budget_to)) {
        form.setError("budget_to", {
          type: "manual",
          message: "Maksymalna kwota budżetu musi być większa od minimalnej.",
        });
        return;
      }

      const success = await submitForm(data);
      if (success) {
        // Reset form after successful submission
        setTimeout(() => {
          form.reset();
        }, 3000);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      // Set a general error message
      form.setError("root", {
        type: "manual",
        message:
          "An error occurred while submitting the form. Please try again.",
      });
    }
  }

  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      {/* Application Specialist Section */}
      <section className="w-full px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div id="formularz" className="mb-12 text-center">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-bold tracking-tight uppercase md:text-5xl"
            >
              Zostaw zgłoszenie{" "}
              <span className="text-orange-400">już teraz</span>, a my wykonamy
              pierwszą wycenę ZA DARMO!
            </motion.h2>
            <motion.p
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-gray-400"
            ></motion.p>
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
                          initial={{
                            y: 100,
                            opacity: 0,
                          }}
                          whileInView={{
                            y: 0,
                            opacity: 1,
                          }}
                          transition={{ delay: 0.2 }}
                        >
                          <Input
                            placeholder="Telefon"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
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
                          initial={{
                            y: 100,
                            opacity: 0,
                          }}
                          whileInView={{
                            y: 0,
                            opacity: 1,
                          }}
                          transition={{ delay: 0.3 }}
                        >
                          <Input
                            placeholder="Imię i Nazwisko"
                            {...field}
                            className="h-12"
                          />
                        </motion.div>
                      </FormControl>
                      <FormMessage className="mt-1 text-sm text-red-600" />
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
                            initial={{
                              y: 100,
                              opacity: 0,
                            }}
                            whileInView={{
                              y: 0,
                              opacity: 1,
                            }}
                            transition={{
                              delay: 0.4,
                            }}
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
                      <FormMessage className="mt-1 text-sm text-red-600" />
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
                          initial={{
                            y: 100,
                            opacity: 0,
                          }}
                          whileInView={{
                            y: 0,
                            opacity: 1,
                          }}
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
                      <FormMessage className="mt-1 text-sm text-red-600" />
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
                          initial={{
                            y: 100,
                            opacity: 0,
                          }}
                          whileInView={{
                            y: 0,
                            opacity: 1,
                          }}
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
                      <FormMessage className="mt-1 text-sm text-red-600" />
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
                          <FormMessage className="mt-1 text-sm text-red-600" />
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
                className="flex w-full flex-col space-y-2"
              >
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess || !openStatusId}
                    className={`text-foreground w-full border border-orange-400 bg-transparent px-8 py-5 transition-colors hover:bg-orange-400 md:w-auto ${
                      isSuccess
                        ? "border-green-600 bg-green-600 text-white"
                        : ""
                    }`}
                  >
                    {isSubmitting
                      ? "Wysyłanie..."
                      : isSuccess
                        ? "Wysłano Pomyślnie"
                        : "Wyślij"}
                  </Button>
                </div>
              </motion.div>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
