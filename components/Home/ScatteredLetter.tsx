"use client";
import { motion } from "framer-motion";

const ScatteredLetters = () => {
  const generateScatteredLetters = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const positions = [];

    for (let i = 0; i < 150; i++) {
      positions.push({
        letter: letters[Math.floor(Math.random() * letters.length)],
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.3 + 0.1,
        size: Math.random() * 20 + 10,
        rotation: Math.random() * 360, // initial rotation
        duration: Math.random() * 6 + 4, // random speed
      });
    }

    return positions;
  };

  const scatteredLetters = generateScatteredLetters();

  return (
    <div className="absolute h-[50rem]  z-10 overflow-hidden inset-0 pointer-events-none">
      {scatteredLetters.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-white font-bold select-none"
          initial={{ rotate: item.rotation }}
          animate={{ rotate: item.rotation + 360 }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            opacity: item.opacity,
            fontSize: `${item.size}px`,
          }}
        >
          {item.letter}
        </motion.div>
      ))}
    </div>
  );
};

export default ScatteredLetters;
