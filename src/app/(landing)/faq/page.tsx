import { Faq } from "@/features/ui/faq";

function Page() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl lg:text-5xl">
        Popularne <span className="text-orange-400">pytania</span>
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
        Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszych
        usług i procesu importu samochodów.
      </p>
      <Faq />
    </div>
  );
}

export default Page;
