// components/Panel9.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

// Animation variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const panelData = [
  
  {
    icon: "/images/panel9/icon1.svg",
    title: "All India Toppers",
    text: (
      <>
        Top 3 performers of each class at National level will win Prizes worth Rs 5,100, Rs 11,000 and Rs 21,000
      </>
    ),
  },
  {
    icon: "/images/panel9/icon2.svg",
    title: "Regional Toppers",
    text: (
      <>
        Prizes worth Rs.3,100, Rs.4,100 and Rs.5,100 for top 3 state toppers in every class and certificate
      </>
    ),
  },
  {
    icon: "/images/panel9/icon3.svg",
    title: "District Toppers",
    text: (
      <>
        Prizes worth Rs.1,100, Rs.2,100 and Rs.3,100 for top 3 district toppers in every class and certificate
      </>
    ),
  },
];

const Panel9: React.FC = () => (
  <section className="w-full bg-[#FEF3E6] py-10 md:py-24 flex flex-col items-center md:pb-0">
    <div className="w-full max-w-7xl flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-6 px-4 md:px-10">
      {panelData.map((item, idx) => (
        <motion.div
          key={item.title}
          className="flex flex-col items-center md:items-center mb-8 md:mb-0"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ delay: idx * 0.2 }}
        >
          <Image
            src={item.icon}
            alt={item.title}
            width={60}
            height={60}
            className="mb-3 md:mb-4"
          />
          <h3 className="text-[20px] md:text-[24px] font-bold text-black mb-2 text-center">
            {item.title}
          </h3>
          <p className="text-[16px] md:text-[17px] text-black text-center max-w-[260px] md:max-w-none">
            {item.text}
          </p>
        </motion.div>
      ))}
    </div>
    {/* Illustration: animated in view */}
    <motion.div
      className="flex justify-center w-full mt-8 md:mt-12 mb-0 pb-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ delay: panelData.length * 0.2 }}
    >
      <Image
        src="/images/panel9/icon5.svg"
        alt="Toppers Illustration"
        width={380}
        height={260}
        className="h-auto mb-0 pb-0"
        priority
      />
    </motion.div>
  </section>
);

export default Panel9;
