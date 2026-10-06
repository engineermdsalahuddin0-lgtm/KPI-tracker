import { useEffect } from 'react';

export default function useMagneticHover() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let active = null, frame = 0;
    const clear = () => { cancelAnimationFrame(frame); if (active) { active.style.removeProperty('translate'); active = null; } };
    const move = (event) => {
      if (motion.matches || !pointer.matches || event.pointerType === 'touch') return clear();
      const button = event.target.closest?.('.primary, .button, .nav, .textbutton, .segmented button, .chat-launch, .language-switch button');
      if (!button || button.disabled) return clear();
      if (active !== button) { clear(); active = button; }
      const rect = button.getBoundingClientRect();
      const x = Math.max(-4, Math.min(4, (event.clientX - rect.left - rect.width / 2) * .12));
      const y = Math.max(-3, Math.min(3, (event.clientY - rect.top - rect.height / 2) * .12));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (active === button) button.style.translate = `${x}px ${y}px`; });
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerleave', clear);
    window.addEventListener('blur', clear); motion.addEventListener('change', clear);
    return () => { clear(); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', clear); window.removeEventListener('blur', clear); motion.removeEventListener('change', clear); };
  }, []);
}
