"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: shouldReduceMotion ? 0.25 : 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
