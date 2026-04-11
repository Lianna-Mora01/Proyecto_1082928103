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
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Fondo con gradiente y efectos */}
      <div className="absolute inset-0 w-full h-full">
        {/* Gradiente base */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-purple-950 to-black" />

        {/* Orbs animados flotantes */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          animate={{
            y: [0, 100, 0],
            x: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-40 right-1/4 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          animate={{
            y: [0, -100, 0],
            x: [0, -50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/3 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            y: [0, 50, 0],
            x: [0, -50, 0],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />

        {/* Patrón de puntos animados */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Líneas de energía */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00d9ff" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#grad1)" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="url(#grad1)" strokeWidth="1" opacity="0.5" />
          <circle cx="50%" cy="50%" r="30%" fill="none" stroke="url(#grad1)" strokeWidth="1" />
        </svg>
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
              className="text-7xl sm:text-8xl font-bold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              variants={letterVariants}
              style={{ display: 'inline-block', perspective: '1000px' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Línea divisora */}
        <motion.div
          className="h-1 w-48 bg-linear-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8"
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
