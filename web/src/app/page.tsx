"use client";

import { motion } from "framer-motion";
import { Activity, ShieldCheck, Stethoscope, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-8 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-secondary/15 rounded-full blur-[150px] -z-10" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-panel text-sm text-primary-dark">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-gray-300 font-medium">ConSafeDev Aprobado · Nivel Gold Standard</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
          Angélica <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Med</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
          Inteligencia Artificial Médica estructurada bajo los más altos estándares clínicos. 
          Triaje seguro, anamnesis estructurada y mapas de decisión basados en evidencia.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-semibold rounded-2xl shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-shadow"
          >
            <Stethoscope className="w-5 h-5" />
            Iniciar Consulta RAG
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 glass-panel text-white font-semibold rounded-2xl hover:bg-white/5 transition-colors"
          >
            <Activity className="w-5 h-5 text-secondary" />
            Panel Médico
          </motion.button>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="absolute bottom-12 w-full max-w-5xl px-8 flex justify-between items-end invisible md:visible">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel px-6 py-4 rounded-xl flex flex-col"
        >
          <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Base de Conocimiento</span>
          <span className="text-2xl font-bold text-white flex items-center gap-2">
            11 <span className="text-sm font-normal text-gray-500">Tomos Aprobados</span>
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-panel px-6 py-4 rounded-xl flex flex-col text-right"
        >
          <span className="text-gray-400 text-xs uppercase tracking-wider mb-1">Precisión RAG</span>
          <span className="text-2xl font-bold text-primary flex items-center justify-end gap-2">
            4,805 <span className="text-sm font-normal text-gray-500">Chunks Activos</span>
          </span>
        </motion.div>
      </div>

    </main>
  );
}
