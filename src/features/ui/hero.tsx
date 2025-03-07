"use client";

import { motion } from "framer-motion";
import Socials from "./hero/socials";
import { useEffect, useState } from "react";

const feats = [
  {
    title: "60 dni",
    desc: "dostawa samochodu",
  },
  {
    title: "5 lat",
    desc: "na rynku dostaw",
  },
  {
    title: "5000 samochodów +",
    desc: "zadowolonych klientów",
  },
];

function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <header className="relative isolate min-h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://autodia.pl/skins/html/img/video_new_2.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      <main className="absolute inset-0 z-10 flex h-full w-full flex-col justify-between p-6 sm:p-12 md:grid md:grid-cols-2 md:items-center lg:p-16">
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -500 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-3xl font-extrabold uppercase sm:text-4xl md:text-5xl lg:text-7xl"
            >
              authoritycars.com
            </motion.h1>
            <motion.p
              initial={{ x: -550 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-base font-extrabold text-orange-400 sm:text-lg md:text-xl lg:text-2xl"
            >
              KUP SAMOCHÓD Z AUKCJI ŚWIATOWYCH
            </motion.p>
          </div>
          <div className="mt-8 flex flex-col items-start justify-start gap-8 md:mt-0">
            <motion.div
              initial={{ x: -500 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="border-l-4 border-orange-400 pl-4 text-sm sm:pl-6 sm:text-base md:text-lg lg:text-xl"
            >
              USA, EUROPA, KANADA, KOREA I CHINY
              <br />
              OTRZYMAJĄ DO 40%
              <br />
              RÓŻNORODNOŚCI TWOJEGO RYNKU!
            </motion.div>
            <Socials />
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-start gap-4 md:mt-0 md:items-end md:justify-start md:pt-24">
          {feats.map((feat, i) => (
            <motion.div
              initial={{ x: isMobile ? -500 : 500 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              key={feat.title}
              className="flex w-full flex-col items-start justify-center gap-1 md:w-64"
            >
              <h2 className="text-xl font-bold text-orange-400 uppercase sm:text-2xl">
                {feat.title.split(" ")[0]}
                <span className="text-xs sm:text-sm">
                  {" "}
                  {feat.title.split(" ")[1]}
                </span>
              </h2>
              <p className="text-xs font-bold uppercase sm:text-sm">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </header>
  );
}

export default Hero;
