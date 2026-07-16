"use client";

import React from "react";
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export type ToastType = "success" | "warning" | "info" | "error";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose: () => void;
  className?: string;
}

export function Toast({ message, type = "success", visible, onClose, className }: ToastProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-accent-mint" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-accent-orange" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-primary-pink" />;
      default:
        return <Info className="w-4 h-4 text-accent-cyan" />;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#090d1a]/95 border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md max-w-sm",
            className
          )}
        >
          {getIcon()}
          <span className="text-xs font-mono font-medium text-slate-200 uppercase tracking-wider">
            {message}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
