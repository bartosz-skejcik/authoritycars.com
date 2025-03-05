"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
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
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * idx }}
          key={question.question}
        >
          <AccordionItem value={`item-${idx}`} className="group">
            <AccordionTrigger className="text-medium px-1.5 text-lg group-hover:bg-orange-400 group-hover:text-orange-950">
              {question.question}
            </AccordionTrigger>
            <AccordionContent className="py-5 text-lg">
              {question.answer}
            </AccordionContent>
          </AccordionItem>
          <Separator />
        </motion.div>
      ))}
    </Accordion>
  );
}
