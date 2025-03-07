"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const questions = [
  {
    question: "Jakie usługi świadczysz?",
    answer:
      "- zakup, transport, odprawa celna, certyfikacja pojazdów;\n- usługi logistyczne dostaw do portów europejskich;\n- wstępna pełna kontrola samochodów na aukcjach;\n- naprawy samochodów pod klucz;\n- Komunikacja i wsparcie we wszystkich kwestiach 24 godziny na dobę, 7 dni w tygodniu.",
  },
  {
    question: "Co obejmuje usługa samochodu pod klucz?",
    answer:
      "- Profesjonalny dobór, wyszukiwanie i zakup samochodu na życzenie klienta;\n- Kalkulacja szacunkowego kosztu samochodu i kalkulacja korzyści w porównaniu z rynkiem wtórnym;\n- Szczegółowe sprawdzenie przy użyciu usług CarFax , AutoAstat, AutoHelperBot;\n- Transport, świadczenie usług spedycyjnych i brokerskich;\n- Pomoc w odprawie celnej samochodów;\n- Organizacja wysokiej jakości napraw samochodów, zakup części zamiennych, kontrola procesu renowacji;\n- Pomoc w rejestracji.",
  },
  {
    question:
      "Jaki jest koszt dostarczenia samochodu? Na czym może jej zależeć?",
    answer:
      "Koszty dostawy mogą się różnić w zależności od lokalizacji samochodu i wymiarów pojazdu. Aby uzyskać poradę i szczegółowe kalkulacje kosztów, skontaktuj się z naszymi ekspertami.",
  },
  {
    question: "Jaki jest koszt odprawy celnej? Od czego to zależy?",
    answer:
      "Koszt odprawy celnej zależy od następujących czynników: ceny zakupu samochodu na aukcji + opłata aukcyjna, roku produkcji samochodu, rodzaju i pojemności silnika.",
  },
  {
    question: "Jak opłacalny jest import samochodu z Ameryki?",
    answer:
      "Oszczędności przy zakupie amerykańskiego samochodu wynoszą średnio 15-30%, biorąc pod uwagę wszystkie wydatki, takie jak: koszt samochodu, cła, usługi firmowe i koszty dostawy.",
  },
  {
    question: "Jak obliczyć koszt samochodu?",
    answer:
      "Aby uzyskać szczegółowe obliczenia, możesz skontaktować się z naszym menedżerem za pomocą WhatsApp. Kalkulacja samochodu jest w naszej firmie usługą bezpłatną.",
  },
  {
    question: "Jakie są zalety samochodów amerykańskich?",
    answer:
      "Główne zalety:\n- Duży wybór: na aukcjach w USA jest duży wybór samochodów, więc nasz menadżer wybierze samochód na każdy gust i każdą kieszeń;\n- Czysta historia: znacznie łatwiej się dowiedzieć informacja o samochodzie;\n- Oszczędność: zakup amerykańskiego samochodu jest średnio 15–30% tańszy;\n- Płatność etapowa;\n- Jakość wykonania;\n- Prawdziwy przebieg: w USA za zawyżanie przebiegu grozi odpowiedzialność karna.",
  },
  {
    question: "Czy amerykański samochód naprawdę ma przejrzystą historię?",
    answer:
      "Wszystkie samochody wystawione na aukcjach ubezpieczeniowych posiadają rzetelne informacje. Historię samochodu można łatwo sprawdzić na specjalnych zasobach.",
  },
  {
    question: "Czy muszę zapłacić od razu? Czy istnieje płatność etapowa?",
    answer:
      "Współpracując z naszą firmą płacisz za samochód etapami, zgodnie z umową. Etapy płatności: zapłata kosztu samochodu + opłata aukcyjna + logistyka do portów europejskich, zapłata za odprawę celną, zapłata za dostawę paczki samochodowej.",
  },
  {
    question: "Jak sprawdzić samochód?",
    answer:
      "Wszystkie samochody skupujemy wyłącznie od zaufanych firm ubezpieczeniowych i szczegółowo je sprawdzamy przed zakupem za pomocą CarFax i innych źródeł.",
  },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {questions.map((question, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          key={question.question}
          className="overflow-hidden"
        >
          <AccordionItem value={`item-${idx}`} className="group">
            <AccordionTrigger className="px-2 py-4 text-left text-sm font-medium transition-all duration-200 ease-in-out group-hover:bg-orange-400 group-hover:text-orange-950 sm:text-base md:text-lg">
              {question.question}
            </AccordionTrigger>
            <AccordionContent className="px-2 py-4 text-sm sm:text-base">
              {question.answer.split("\n").map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  );
}
