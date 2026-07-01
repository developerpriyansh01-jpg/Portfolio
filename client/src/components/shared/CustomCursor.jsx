import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const outlineRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const outlinePos = useRef({ x: 0, y: 0 });
  const animFrame = useRef();

  useEffect(() => {
    // Hide on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveCursor = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animateOutline = () => {
      outlinePos.current.x += (pos.current.x - outlinePos.current.x) * 0.15;
      outlinePos.current.y += (pos.current.y - outlinePos.current.y) * 0.15;
      if (outlineRef.current) {
        outlineRef.current.style.left = `${outlinePos.current.x}px`;
        outlineRef.current.style.top = `${outlinePos.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(animateOutline);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    animFrame.current = requestAnimationFrame(animateOutline);

    // Add hover listeners to interactive elements
    const interactives = document.querySelectorAll('a, button, [data-cursor-hover]');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      cancelAnimationFrame(animFrame.current);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99999 }} />
      <div
        ref={outlineRef}
        className={`cursor-outline ${isHovering ? 'hovering' : ''}`}
        style={{ position: 'fixed', pointerEvents: 'none', zIndex: 99998 }}
      />
    </>
  );
}
