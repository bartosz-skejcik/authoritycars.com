"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const steps = [
  {
    id: 1,
    title: "Wybór pojazdu",
    description:
      "Określenie swoich oczekiwań jest najważniejsze, dlatego najpierw warto rozeznać się w ofercie samochodów dostępnych w USA, żeby wybrać te najbardziej interesujące. Podczas pierwszego kontaktu określają Państwo markę, model, wersję silnikową, wymagane wyposażenie, rocznik i tym podobne. Im więcej konkretnych informacji otrzymamy, tym łatwiej będzie nam znaleźć odpowiednie auto. Należy również określić maksymalną kwotę, jaką chcą Państwo przeznaczyć na zakup samochodu. Wyposażeni w takie informacje będziemy mogli ruszyć na poszukiwania. Oferty wyślemy mailem lub za pośrednictwem wybranego komunikatora (Facebook Messenger, WhatsApp).",
  },
  {
    id: 2,
    title: "PODPISANIE UMOWy i wPŁATA DEPOZYTU",
    description:
      "Podpisujemy umowę na import wybranego wcześniej pojazdu oraz wpłacacie Państwo depozyt na nasze konto w kwocie nie mniejszej niż 3690 zł brutto (jest to równowartość minimalnej prowizja pośrednika). Depozyt jest formą zabezpieczenia dla pośrednika w przypadku wycofania się przez nabywcę z zakupu auta po wygraniu licytacji. Dom aukcyjny pobiera karę pieniężną w przypadku rezygnacji licytującego. Kara finansowa w przypadku niezapłacenia za auto może być wyższa niż wpłacony depozyt. Warto jednak od razu podkreślić, że jesteśmy uzależnieni również od nieprzewidzianych czynników. Zawsze staramy się doprowadzić do tego, by koszt importu auta z USA był możliwie najkorzystniejszy dla naszych klientów.",
  },
  {
    id: 3,
    title: "KALKULACJA KOSZTÓW",
    description:
      "Choć ostateczny koszt sprowadzenia auta jest trudny do określenia, to staramy się przedstawić przybliżone koszty dla różnych scenariuszy wydarzeń. Transport lądowy, transport morski, opłaty celne, wysokość podatku VAT oraz akcyzy, czy przygotowanie samochodu do rejestracji różnią się kosztami w zależności od ceny samochodu, wybranego portu eksportowego i docelowego itp. Dlatego ostateczny całkowity koszt sprowadzenia auta z USA może różnić się od przedstawionej przez nas kalkulacji. Są jednak pewne stałe opłaty, które pozwalają na przedstawienie szacunkowej łącznej sumy transakcji.",
  },
  {
    id: 4,
    title: "WERYFIKACJA POJAZDU W BAZIE CARFAX",
    description:
      "Po wytypowaniu konkretnych egzemplarzy przystępujemy do sprawdzenia ich historii w bazie Carfax. To najbardziej znana komercyjna usługa internetowa, która pozwala na weryfikację auta pod kątem stanu, przebiegu, historii serwisowej i ewentualnych napraw po zdarzeniach drogowych. Firma Carfax ma dostęp m.in. do baz organów ewidencji pojazdów z 50 stanów w USA i wszystkich prowincji w Kanadzie, a także do baz policji, straży pożarnej i innych służb. To czyni Carfax najbardziej zaufanym źródłem informacji o używanych samochodach i motocyklach z USA i Kanady. Korzystamy również z bazy EpicVIN. Usługa sprawdzenia historii pojazdu jest darmowa dla naszych Klientów depozytowych.",
  },
  {
    id: 5,
    title: "Inspekcja techniczna pojazdu",
    description:
      "Klient może również zlecić wykonanie odpłatnej inspekcji licytowanego pojazdu wraz z wykonaniem dodatkowych zdjęć, co pozwoli zweryfikować stan faktyczny z tym, co widnieje w informacjach przedstawionych przez dom aukcyjny. To czyni zakup jeszcze bezpieczniejszym.",
  },
  {
    id: 6,
    title: "Licytacja",
    description:
      "Kolejny krok to licytacja, która odbywa się na żywo i zachęcamy naszych klientów do obserwowania jej. Dzięki temu można skorygować budżet, jeżeli dany pojazd jest naprawdę wyjątkowy i chce się o niego skutecznie powalczyć. W trakcie licytacji pozostajemy w ciągłym kontakcie tak, żeby móc szybko reagować na sugestie i zmiany.",
  },
];

function Timeline() {
  const [activeStep, setActiveStep] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [carPosition, setCarPosition] = useState({ top: 0, visible: false });

  // Initialize the refs array for all steps
  if (stepRefs.current.length !== steps.length) {
    stepRefs.current = Array(steps.length).fill(null);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !timelineRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const timelineRect = timelineRef.current.getBoundingClientRect();

      // Check if container is in viewport
      const containerTop = containerRect.top;
      const containerBottom = containerRect.bottom;
      const containerHeight = containerRect.height;
      const viewportHeight = window.innerHeight;

      // Only show car when container is in view
      const isContainerVisible =
        containerTop < viewportHeight && containerBottom > 0;

      // Position car at center of visible portion of container
      let carTop = 0;

      if (isContainerVisible) {
        // Calculate center point of visible container
        const visibleTop = Math.max(0, containerTop);
        const visibleBottom = Math.min(viewportHeight, containerBottom);
        const visibleHeight = visibleBottom - visibleTop;
        const visibleCenter = visibleTop + visibleHeight / 2;

        // Convert to position relative to container
        carTop = visibleCenter - containerTop;

        // Clamp to container bounds
        carTop = Math.max(0, Math.min(containerHeight, carTop));

        // Calculate active step based on what's closest to the car
        let closestStep = 0;
        let closestDistance = Infinity;

        stepRefs.current.forEach((stepRef, index) => {
          if (!stepRef) return;

          const stepRect = stepRef.getBoundingClientRect();
          const stepCenter = stepRect.top + stepRect.height / 2;
          const distance = Math.abs(stepCenter - visibleCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestStep = index;
          }
        });

        setActiveStep(closestStep);
      }

      setCarPosition({
        top: carTop,
        visible: isContainerVisible,
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run immediately

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="flex w-full flex-col items-center justify-start gap-4 px-4 pt-12 pb-24 md:px-14 md:pb-32">
      <h1 className="text-center text-4xl font-extrabold text-orange-400 uppercase md:text-6xl">
        Jak kupić auto z USA
        <br />{" "}
        <span className="text-foreground font-normal">krok po kroku?</span>
      </h1>
      <p className="mb-12 text-lg">
        Poniżej przedstawiamy Państwu procedurę zakupu importowanego auta lub
        innego pojazdu z USA i Kanady.
      </p>

      {/* Container with relative positioning to contain the car and timeline */}
      <div ref={containerRef} className="relative w-full max-w-7xl">
        {/* The vertical line that connects all steps - contained within the component */}
        <div className="absolute top-0 bottom-0 left-1/2 z-10 w-px -translate-x-1/2 bg-neutral-600"></div>

        {/* Car icon positioned dynamically based on scroll */}
        {carPosition.visible && (
          <div
            className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
            style={{ top: carPosition.top }}
          >
            <Image src="/car.webp" alt="Car" height={32} width={32} />
          </div>
        )}

        {/* Timeline content */}
        <div ref={timelineRef} className="relative mx-auto">
          {/* Padding at top to allow first item to reach center */}
          <div className="h-[25vh]"></div>

          {/* Timeline steps */}
          {steps.map((step, index) => (
            <div
              key={step.id}
              // @ts-expect-error asdf
              ref={(el) => (stepRefs.current[index] = el)}
              className={`relative mb-40 flex items-center transition-opacity duration-300 last:mb-0 ${
                index > activeStep ? "opacity-60" : "opacity-100"
              }`}
            >
              {/* Title on the left */}
              <div className="mr-auto w-5/12 pr-8 text-right">
                <h3
                  className={`mb-2 text-xl font-bold uppercase lg:text-3xl xl:text-4xl ${
                    index === activeStep ? "text-orange-400" : "text-white"
                  }`}
                >
                  {step.title}
                </h3>
              </div>

              {/* Dot marker */}
              <div className="absolute left-1/2 z-10 -translate-x-1/2">
                <div
                  className={`h-4 w-4 rounded-full ${
                    index <= activeStep ? "bg-red-600" : "bg-neutral-600"
                  }`}
                ></div>
              </div>

              {/* Description on the right */}
              <div className="ml-auto w-5/12 pl-8">
                <p
                  className={`lg:text-xl ${
                    index === activeStep ? "text-white" : "text-foreground"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}

          {/* Padding at bottom to allow last item to reach center */}
          <div className="h-[25vh]"></div>
        </div>
      </div>
    </section>
  );
}

export default Timeline;
