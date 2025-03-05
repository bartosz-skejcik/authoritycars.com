"use client";

import { motion } from "motion/react";
import Socials from "./hero/socials";

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
  return (
    <header className="relative isolate h-screen w-full">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-25"
        autoPlay
        loop
      >
        <source
          src="https://autodia.pl/skins/html/img/video_new_2.mp4"
          type="video/mp4"
        />
      </video>

      <main className="absolute inset-0 z-10 grid h-full w-full items-center overflow-hidden p-12 md:grid-cols-2">
        <div className="flex h-full flex-col items-start justify-between">
          <div className="flex flex-col gap-4">
            <motion.h1
              initial={{ opacity: 0, x: -500 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl font-extrabold uppercase md:text-7xl"
            >
              authoritycars.com
            </motion.h1>
            <motion.p
              initial={{ x: -550 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg font-extrabold text-orange-400 md:text-2xl"
            >
              KUP SAMOCHÓD Z AUKCJI ŚWIATOWYCH
            </motion.p>
          </div>
          <div className="flex flex-col items-start justify-start gap-8">
            <motion.div
              initial={{ x: -500 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="border-l-4 border-orange-400 pl-6 text-xl"
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
        <div className="hidden h-full flex-col items-end justify-start gap-4 pt-24 md:flex">
          {feats.map((feat, i) => (
            <motion.div
              initial={{ x: 500 }}
              animate={{ x: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              key={feat.title}
              className="flex w-64 flex-col items-start justify-center gap-1"
            >
              <h2 className="text-2xl font-bold text-orange-400 uppercase">
                {/** split the title " " and the second part should be smaller **/}
                {feat.title.split(" ")[0]}
                <span className="text-sm"> {feat.title.split(" ")[1]}</span>
              </h2>
              <p className="text-sm font-bold uppercase">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </header>
  );
}

export default Hero;
