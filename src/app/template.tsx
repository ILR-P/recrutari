"use client";

import { motion } from "motion/react";

// Doar opacitate: transform sau filter pe acest wrapper ar strica elementele `fixed` din pagină.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
      {children}
    </motion.div>
  );
}
