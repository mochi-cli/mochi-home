"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** delay in ms before the element animates in */
  delay?: number;
  /** fired once, the first time this block scrolls into view */
  onVisible?: () => void;
  /** "rise" for headings and copy, "soft" for cards, tables and product windows */
  variant?: "rise" | "soft";
  as?: "div" | "section" | "li";
}

export default function Reveal({ children, className = "", delay = 0, as = "div", onVisible, variant = "rise" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  // Kept in a ref so a caller passing an inline arrow does not re-run the
  // observer effect below. Synced in its own effect rather than during render,
  // which is not a legal place to touch a ref.
  const onVisibleRef = useRef(onVisible);
  useEffect(() => {
    onVisibleRef.current = onVisible;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            onVisibleRef.current?.();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${variant === "soft" ? "reveal-soft" : ""} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
