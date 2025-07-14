// components/Panel4.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

// Fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-inter",
});

const reasons = [
  {
    icon: "/images/panel4/icon1.svg",
    text: (
      <>Accelerates Comprehensive <strong>Academic Growth</strong></>
    ),
  },
  {
    icon: "/images/panel4/icon2.svg",
    text: (
      <>Enhances <strong>Cognitive Retention and Recall</strong></>
    ),
  },
  {
    icon: "/images/panel4/icon3.svg",
    text: (
      <>Develops <strong>Strategic Thinking</strong> Frameworks</>
    ),
  },
  {
    icon: "/images/panel4/icon4.svg",
    text: (
      <>Cultivates <strong>Achievement-Oriented Mindset</strong></>
    ),
  },
  {
    icon: "/images/panel4/icon5.svg",
    text: (
      <>Strengthens <strong>Neural Pathways and Focus</strong></>
    ),
  },
];

const Panel4: React.FC = () => (
  <motion.section
    className={`${poppins.variable} ${inter.variable} w-full bg-[#FEF3E6] py-10 pt-24`}
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    id="why-olympiad"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 px-4 md:px-12">
      {/* Heading + line across both columns */}
      <motion.div
        className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start mb-2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#A62828] text-center md:text-left"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Why Olympiad
        </h2>
        <div className="h-[2px] w-24 bg-black mt-4 mb-6 mx-auto md:mx-0" />
      </motion.div>

      {/* Left: Video */}
      <motion.div
        className="w-full aspect-video bg-black rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <iframe
          src="https://www.youtube.com/embed/BUytazwEUkc"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </motion.div>

      {/* Right: Reasons List */}
      <div className="w-full flex flex-col justify-center space-y-7">
        {reasons.map((reason, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.4 + idx * 0.1, duration: 0.6 }}
          >
            <Image
              src={reason.icon}
              alt={`Reason ${idx + 1}`}
              width={40}
              height={40}
              className="min-w-[40px] min-h-[40px]"
            />
            <p
              className="text-[17px] md:text-[18px] leading-snug"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {reason.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.section>
);

export default Panel4;
