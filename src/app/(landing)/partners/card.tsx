import Image from "next/image";

type Props = {
  title: string;
  image: string;
};

function Card({ title, image }: Props) {
  return (
    <div className="flex flex-col">
      <div className="relative mb-8 h-80 w-full md:h-96">
        <Image
          src={image}
          alt="orange Audi car in shipping container"
          fill
          className="rounded-sm object-cover"
          priority
        />
      </div>
      <div className="mt-auto">
        <h3 className="mb-2 text-2xl font-bold capitalize md:text-3xl">
          {title}
        </h3>
        <div className="h-1 w-12 bg-orange-400"></div>
      </div>
    </div>
  );
}

export default Card;
