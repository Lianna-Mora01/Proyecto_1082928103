"use client";

import { motion } from "framer-motion";
import type { HomeContent } from "@/lib/types";

interface HolaMundoProps {
  content: HomeContent;
}

export default function HolaMundo({ content }: HolaMundoProps) {
  const letters = content.greeting.split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
    },
  };

  const letterVariant = {
    hidden: { opacity: 0, y: 60, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { type: "spring" as const, damping: 12, stiffness: 100 },
    },
  };

  const subtitleVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 1.2, duration: 0.8 },
    },
  };

  const lineVariant = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 1.6, duration: 0.8 },
    },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 overflow-hidden">
      {/* Resplandor de fondo */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Puntos decorativos de fondo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Título animado letra por letra */}
      <motion.h1
        className="relative flex flex-wrap justify-center text-6xl font-bold tracking-tight text-white md:text-8xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ perspective: "800px" }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            variants={letterVariant}
            style={{ display: "inline-block" }}
            className={letter === " " ? "mx-3" : ""}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.h1>

      {/* Línea divisora animada */}
      <motion.div
        className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"
        variants={lineVariant}
        initial="hidden"
        animate="visible"
      />

      {/* Subtítulo */}
      <motion.p
        className="mt-6 text-sm font-medium tracking-widest text-zinc-400 uppercase"
        variants={subtitleVariant}
        initial="hidden"
        animate="visible"
      >
        {content.subtitle}
      </motion.p>

      {/* Badge de versión */}
      <motion.span
        className="mt-10 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1 text-xs text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        v{content.version}
      </motion.span>
    </main>
  );
}
