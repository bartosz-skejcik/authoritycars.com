"use client";

import { motion } from "motion/react";
import Image from "next/image";

function Contact() {
  return (
    <section className="relative w-full overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
        <span className="text-[20vw] font-bold text-gray-500">request</span>
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-8 md:mb-0">
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="mb-2 text-4xl font-bold md:text-5xl"
            >
              <span className="text-orange-400">Kontakt</span>
            </motion.h2>
            <motion.p
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6 text-gray-400"
            >
              Dostarczanie samochodów
            </motion.p>
            <motion.a
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              href="tel:+48881570596"
              className="text-3xl font-bold transition-colors hover:text-orange-400 md:text-4xl"
            >
              +48 881 57 05 96
            </motion.a>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative h-48 w-full md:h-64 md:w-1/2"
          >
            <Image
              src="/chevrolet_camaro.avif"
              alt="orange sports car"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
