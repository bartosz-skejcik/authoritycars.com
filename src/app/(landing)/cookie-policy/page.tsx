export default function CookiePolicy() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-6 px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl lg:text-5xl">
        Polityka <span className="text-orange-400">Cookies</span>
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
        Nasza strona internetowa używa plików cookies w celu zapewnienia jej
        prawidłowego działania, poprawy komfortu użytkowania oraz analizy ruchu.
      </p>
      <div className="space-y-4 text-base">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Czym są pliki cookies?</h2>
          <p>
            Cookies to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu.
            Pomagają nam dostosować treści do Twoich preferencji i analizować
            sposób korzystania ze strony.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Jakie cookies wykorzystujemy?</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Niezbędne – zapewniają prawidłowe działanie strony.</li>
            <li>
              Analityczne – pomagają nam analizować ruch i optymalizować treści.
            </li>
            <li>Marketingowe – służą do wyświetlania dopasowanych reklam.</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">Jak zarządzać cookies?</h2>
          <p>
            Możesz zmienić ustawienia cookies w swojej przeglądarce i usunąć
            zapisane pliki w dowolnym momencie.
          </p>
        </div>
      </div>
    </div>
  );
}
