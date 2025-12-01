import { memo, useEffect, useState, useRef, useCallback } from "react";

const sectionIds = [
  "hero",
  "depression-intro",
  "causes",
  "crash",
  "consequences",
  "roosevelt",
  "new-deal",
  "reforms",
  "economy",
  "foreign-policy",
  "society",
  "culture",
  "technology",
  "legacy",
  "conclusion",
];

export const SectionIndicator = memo(() => {
  const [activeSection, setActiveSection] = useState(0);
  const rafRef = useRef<number>();
  const sectionsRef = useRef<Array<{ id: string; element: HTMLElement | null }>>([]);

  // Кешируем элементы секций
  useEffect(() => {
    sectionsRef.current = sectionIds.map((id) => ({
      id,
      element: document.getElementById(id),
    }));
  }, []);

  const updateActiveSection = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = sectionsRef.current[i];
      if (section?.element) {
        const rect = section.element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        
        if (elementTop <= scrollPosition) {
          setActiveSection((prev) => {
            if (prev !== i) {
              return i;
            }
            return prev;
          });
          break;
        }
      }
    }

    rafRef.current = undefined;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateActiveSection);
      }
    };

    // Обновляем кеш при изменении размера окна
    const handleResize = () => {
      sectionsRef.current = sectionIds.map((id) => ({
        id,
        element: document.getElementById(id),
      }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateActiveSection]);

  const scrollToSection = useCallback((index: number) => {
    const section = sectionsRef.current[index];
    if (section?.element) {
      // Сразу обновляем активную секцию при клике для мгновенной обратной связи
      setActiveSection(index);
      
      section.element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
      {sectionIds.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 will-change-[transform,background-color,box-shadow] ${
            index === activeSection
              ? "bg-neon-red scale-150 shadow-[0_0_15px_hsl(var(--neon-red)),0_0_30px_hsl(var(--neon-red)),0_0_45px_hsl(var(--glow-red))]"
              : "bg-foreground/30 hover:bg-foreground/50 hover:shadow-[0_0_10px_hsl(var(--foreground)/0.5)]"
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
});

SectionIndicator.displayName = "SectionIndicator";
