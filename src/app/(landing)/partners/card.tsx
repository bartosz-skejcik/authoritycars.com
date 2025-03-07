"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  image: string;
  image_hover: string;
  hoverText: string;
};

function Card({ title, image, image_hover, hoverText }: Props) {
  return (
    <div className="group relative col-span-1">
      <div className="absolute inset-0 flex opacity-0 transition-all duration-300 group-hover:opacity-100">
        <Image
          src={image_hover}
          alt={title}
          height={512}
          width={512}
          className="w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-start px-6 py-12">
          <h2 className="text-2xl font-bold uppercase lg:text-4xl">{title}</h2>
          <div className="mt-4 h-1 w-12 bg-orange-400" />
          <p className="mt-6 text-lg">{hoverText}</p>
          <Link
            href="/contact"
            className="mt-6 bg-orange-400 px-6 py-2 font-bold text-white transition-all duration-200 hover:bg-orange-500"
          >
            Kontakt
          </Link>
        </div>
      </div>
      <div className="">
        <Image
          src={image}
          alt={title}
          height={512}
          width={512}
          className="w-full object-contain"
        />
        <h2 className="mt-6 text-2xl font-bold uppercase">{title}</h2>
        <div className="mt-2 h-1 w-12 bg-orange-400" />
      </div>
    </div>
  );
}

export default Card;
