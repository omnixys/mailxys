"use client";

import { motion, type Variants } from "framer-motion";

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const slideIn: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

export const staggerChildren: Variants = {
  animate: { transition: { staggerChildren: 0.06 } },
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const FadeIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    variants={fadeIn}
    initial="initial"
    animate="animate"
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    variants={slideIn}
    initial="initial"
    animate="animate"
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

export const StaggerChildren = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <motion.div variants={staggerChildren} initial="initial" animate="animate">
    {children}
  </motion.div>
);
