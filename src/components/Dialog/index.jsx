import React from 'react';
import { motion } from "framer-motion";
import './style.css';

export default function Dialog({ children, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="dialogWrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}