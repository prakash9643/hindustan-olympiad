// components/Panel13.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Panel13: React.FC = () => (
  <motion.section
    className="w-full bg-[#FFF7F3] py-12 px-2 flex justify-center"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={fadeUp}
  >
    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {/* Left: Heading + Line + Subheading + Button */}
      <motion.div
        className="flex flex-col items-center md:items-start flex-1 mb-8 md:mb-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#B2252A] leading-tight text-center md:text-left"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Sample Papers
        </h2>
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 mx-auto md:mx-0" />
        <p className="text-base sm:text-lg md:text-xl font-medium text-[#2d2d2d] mb-5 text-center md:text-left">
          Practice &amp; prepare with our curated sample papers.
        </p>
        <a
          className="rounded-xl bg-[#B2252A] text-white text-base sm:text-lg md:text-xl font-bold px-10 py-3 mt-1 shadow-sm transition hover:bg-[#8c171b] active:scale-95 text-center"
        >
          Coming soon 
        </a>
      </motion.div>

      {/* Right: Image */}
      <motion.div
        className="flex-1 flex justify-center w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ delay: 0.4 }}
      >
        <div className="rounded-2xl overflow-hidden w-full max-w-[500px] shadow-lg">
          <Image
            src="/images/panel13/image1.svg"
            alt="Sample Papers"
            width={560}
            height={360}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </motion.div>
    </div>
  </motion.section>
);

export default Panel13;
