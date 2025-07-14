// components/Panel7.tsx
"use client";

import { Poppins, Inter } from "next/font/google";
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

const videoIds = [
  "sFsenivUj7w",
  "wGpm9CjzA6g",
  "pfnNuVL2bhQ",
];

const Panel7: React.FC = () => (
  <section
    id="olympiad-2025"
    className={`${poppins.variable} ${inter.variable} w-full py-12 px-4 bg-white max-w-7xl mx-auto pb-24`}
  >
    {/* Animated Heading & Subheading */}
    <motion.div
      className="max-w-6xl mx-auto flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      <h2
        className="text-[1.75rem] sm:text-2xl md:text-[2.4rem] font-bold text-[#A62828] text-center"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        Hindustan Olympiad 2025
      </h2>
      <div className="bg-black h-[2px] w-24 mt-4 mb-6 rounded-full" />
    </motion.div>

    {/* Videos with staggered fade-up */}
    <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center">
      {videoIds.map((id, idx) => (
        <motion.div
          key={id}
          className="bg-[#F3F3F3] rounded-xl overflow-hidden flex items-center justify-center w-full max-w-xs md:max-w-sm h-56 md:h-64"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: idx * 0.2, duration: 0.6 }}
        >
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            title={`YouTube video ${idx + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  </section>
);

export default Panel7;
