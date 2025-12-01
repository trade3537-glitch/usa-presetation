import { memo, useEffect, useState, useRef } from "react";

export const ScrollProgress = memo(() => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const safeHeight = Math.max(scrollHeight, 1);
      const scrolled = (window.scrollY / safeHeight) * 100;
      const progress = Math.min(Math.max(scrolled, 0), 100);

      // Используем requestAnimationFrame для плавности, но без интерполяции
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setScrollProgress(progress);
        rafRef.current = undefined;
      });
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-muted/30 z-50">
      <div
        className="h-full bg-gradient-to-r from-neon-blue via-neon-red to-neon-blue will-change-[width]"
        style={{
          width: `${scrollProgress}%`,
          boxShadow: "0 0 20px hsl(var(--neon-red)), 0 0 40px hsl(var(--neon-blue))",
        }}
      />
    </div>
  );
});

ScrollProgress.displayName = "ScrollProgress";
