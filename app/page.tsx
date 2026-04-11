'use client';

import { motion } from 'framer-motion';

export default function HomePage() {
  const name = 'Lianna Mora';
  const doc = '1082928103';
  const greeting = 'Hola Mundo';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 50, rotateY: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', damping: 10, stiffness: 100 },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { delay: 1.5, duration: 0.8 },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black overflow-hidden flex items-center justify-center">
      {/* Fondo animado */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Contenido principal */}
      <motion.div
        className="relative z-10 text-center px-6"
        initial="hidden"
        animate="visible"
      >
        {/* Título animado letra por letra */}
        <motion.div
          className="flex justify-center gap-1 mb-8 flex-wrap"
          variants={containerVariants}
        >
          {greeting.split('').map((char, i) => (
            <motion.span
              key={i}
              className="text-7xl sm:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              variants={letterVariants}
              style={{ display: 'inline-block', perspective: '1000px' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Línea divisora */}
        <motion.div
          className="h-1 w-48 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
          variants={lineVariants}
        />

        {/* Nombre */}
        <motion.div
          className="mb-6"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.2 }}
        >
          <p className="text-2xl sm:text-3xl text-cyan-300 font-semibold">
            👤 {name}
          </p>
        </motion.div>

        {/* Documento */}
        <motion.div
          className="mb-8"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.4 }}
        >
          <p className="text-lg sm:text-xl text-purple-300">
            📄 Documento: <span className="font-mono font-bold text-pink-400">{doc}</span>
          </p>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, type: 'spring', stiffness: 100 }}
        >
          <div className="inline-block px-6 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 backdrop-blur-sm">
            <p className="text-sm text-gray-300">
              ✓ Funcionando en <span className="text-cyan-400 font-semibold">Vercel</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
