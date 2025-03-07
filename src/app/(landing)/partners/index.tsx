import Card from "./card";

function Partners() {
  return (
    <section className="h-screen px-4 py-16 text-white md:h-auto md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Headings */}
        <div id="partner" className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-orange-400 uppercase md:text-2xl">
            do naszych partnerów
          </h2>
          <h1 className="text-4xl font-bold tracking-tight uppercase md:text-6xl">
            dołącz już dziś!
          </h1>
        </div>

        {/* Image and CTA Grid */}
        <div className="grid grid-cols-1 gap-6 pb-12 md:grid-cols-2">
          {/* Left Column */}
          <Card
            title="chcę kupić auto"
            image="/1.jpg"
            image_hover="/1_hover.jpg"
            hoverText="Chcesz kupić samochód i nie chcesz przepłacać? Kup samochód z oszczędnością do 40% i przejrzystą historią. Nasi eksperci wybiorą najlepszą opcję dla Twojego budżetu!"
          />
          {/* Right Column */}
          <Card
            title="zostań partnerem"
            image="/2.jpg"
            image_hover="/2_hover.jpg"
            hoverText="Rozpocznij swój biznes z nami! Zapewniamy najlepsze warunki partnerstwa, wsparcia, konsultacji i szkoleń! Authoritycars jest Twoim niezawodnym partnerem biznesowym!"
          />
        </div>
      </div>
    </section>
  );
}

export default Partners;
