import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollProgressIndicatorProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  showBackToTop?: boolean;
}

export const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({ 
  containerRef,
  showBackToTop = true 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let progress = 0;
      let scrollTop = 0;

      if (containerRef && containerRef.current) {
        const el = containerRef.current;
        scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight - el.clientHeight;
        if (scrollHeight > 0) {
          progress = (scrollTop / scrollHeight) * 100;
        }
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          progress = (scrollTop / scrollHeight) * 100;
        }
      }

      setScrollProgress(Math.min(100, Math.max(0, progress)));
      setIsScrolled(scrollTop > 150);
    };

    const target = containerRef?.current || window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    if (containerRef && containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Fixed Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none">
        <div
          className="h-full scroll-indicator-bar transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Back To Top Button with Circular Progress in Harmonious #5ea85d */}
      {showBackToTop && isScrolled && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-card/95 text-foreground shadow-lg hover:border-primary hover:text-primary transition-all duration-200 group backdrop-blur-xs"
        >
          <div className="relative flex items-center justify-center w-5 h-5">
            <svg className="w-5 h-5 -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-muted/40 stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-primary stroke-current transition-all duration-100 ease-out"
                strokeDasharray={`${scrollProgress}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <ArrowUp className="absolute h-2.5 w-2.5 text-primary group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <span className="text-[11px] font-mono font-semibold text-muted-foreground group-hover:text-foreground">
            {Math.round(scrollProgress)}%
          </span>
        </button>
      )}
    </>
  );
};
