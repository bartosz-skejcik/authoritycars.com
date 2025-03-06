import Card from "./card";

function Partners() {
  return (
    <section className="bg-black px-4 py-16 text-white md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Headings */}
        <div className="mb-12">
          <h2 className="mb-2 text-xl font-bold text-orange-400 md:text-2xl">
            TO OUR PARTNERS
          </h2>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            TERMS OF COOPERATION
          </h1>
        </div>

        {/* Image and CTA Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <Card title="" image="/placeholder.svg?height=500&width=700" />
          {/* Right Column */}
          <Card title="" image="/placeholder.svg?height=500&width=700" />
        </div>
      </div>
    </section>
  );
}

export default Partners;
