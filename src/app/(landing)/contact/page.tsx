"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import SubmissionForm from "@/features/global/submission-form";

function ContactPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Skontaktuj się z nami
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
          Wypełnij poniższy formularz, aby rozpocząć proces importu wymarzonego
          samochodu ze Stanów Zjednoczonych. Nasi eksperci skontaktują się z
          Tobą tak szybko, jak to możliwe.
        </p>
        <SubmissionForm ref={ref || undefined} />
      </div>
    </div>
  );
}

export default ContactPage;
