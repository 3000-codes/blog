'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const WaterDrop: React.FC = () => {
  const dropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { showWaterDrop, waterDropSize } = useTheme();
  
  // We use a ref for size to access the latest value inside the requestAnimationFrame loop
  // without needing to restart the effect/loop every time the size slider moves.
  const sizeRef = useRef(waterDropSize);
  
  useEffect(() => {
    sizeRef.current = waterDropSize;
  }, [waterDropSize]);

  // Physics state stored in refs to avoid re-renders during the animation loop
  const state = useRef({
    x: 0, // Initialize at 0, will update in effect
    y: 100,
    targetX: 0,
    targetY: 100,
    vx: 0,
    vy: 0,
    isDragging: false,
    dragOffsetX: 0,
    dragOffsetY: 0,
    lastDragEndTime: 0
  });

  useEffect(() => {
    // Set initial position based on window width (client-side only)
    const initialX = window.innerWidth / 2 - (waterDropSize / 2);
    state.current.x = initialX;
    state.current.targetX = initialX;

    const drop = dropRef.current;
    const content = contentRef.current;
    if (!drop || !content) return;

    const handleDown = (e: PointerEvent) => {
      state.current.isDragging = true;
      state.current.dragOffsetX = e.clientX - state.current.x;
      state.current.dragOffsetY = e.clientY - state.current.y;
      
      drop.setPointerCapture(e.pointerId);
      content.style.cursor = 'grabbing';
      content.style.transform = 'scale(0.95)';
    };

    const handleMove = (e: PointerEvent) => {
      if (!state.current.isDragging) return;
      state.current.targetX = e.clientX - state.current.dragOffsetX;
      state.current.targetY = e.clientY - state.current.dragOffsetY;
    };

    const handleUp = (e: PointerEvent) => {
      state.current.isDragging = false;
      state.current.lastDragEndTime = Date.now();
      drop.releasePointerCapture(e.pointerId);
      content.style.cursor = 'grab';
      content.style.transform = 'scale(1)';
    };

    // Attach listeners
    drop.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    // Animation Loop for Physics
    let animationFrameId: number;
    const updatePhysics = () => {
      const s = state.current;
      const currentSize = sizeRef.current;
      const bottomLimit = window.innerHeight - currentSize;
      const rightLimit = window.innerWidth - currentSize;

      // Gravity / Flow Logic
      if (!s.isDragging) {
        const timeSinceDrag = Date.now() - s.lastDragEndTime;

        // Only apply gravity if 3 seconds have passed since drag ended
        if (timeSinceDrag > 3000) {
            // Apply a slow downward drift to the target position
            // This simulates high-viscosity liquid flowing down glass
            const gravitySpeed = 1.0; // Pixels per frame (~60px/sec)
            
            if (s.targetY < bottomLimit) {
               s.targetY += gravitySpeed;
            } else {
               // Clamp to bottom
               s.targetY = bottomLimit;
               
               // Dampen vertical velocity when hitting bottom to prevent oscillation
               if (s.vy > 1) {
                   s.vy *= 0.5;
               }
            }
            
            // Side walls constraint (keep it on screen horizontally)
            if (s.targetX < 0) s.targetX = 0;
            if (s.targetX > rightLimit) s.targetX = rightLimit;
        }
      }

      // Spring physics parameters for "Lotus Leaf" feel
      const tension = 0.08; // How fast it follows the cursor/target
      const friction = 0.85; // Damping (0.8-0.9 gives a nice heavy liquid feel)

      const forceX = (s.targetX - s.x) * tension;
      const forceY = (s.targetY - s.y) * tension;

      s.vx += forceX;
      s.vy += forceY;
      s.vx *= friction;
      s.vy *= friction;

      s.x += s.vx;
      s.y += s.vy;

      if (drop) {
        drop.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      }
      
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      if (drop) drop.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showWaterDrop]); // Re-bind if visibility toggles

  if (!showWaterDrop) return null;

  return (
    <div
      ref={dropRef}
      className="fixed top-0 left-0 z-[100] touch-none select-none"
      style={{ 
        width: `${waterDropSize}px`,
        height: `${waterDropSize}px`,
        willChange: 'transform',
        transform: `translate3d(${state.current.x}px, ${state.current.y}px, 0)` 
      }}
    >
      <div
        ref={contentRef}
        className="w-full h-full animate-wobble cursor-grab transition-transform duration-200 ease-out"
        style={{
          background: 'rgba(255, 255, 255, 0.01)',
          backdropFilter: 'blur(0.5px) saturate(180%) contrast(110%) brightness(105%)',
          WebkitBackdropFilter: 'blur(0.5px) saturate(180%) contrast(110%) brightness(105%)',
          boxShadow: `
            inset 20px 20px 60px rgba(255, 255, 255, 0.7),
            inset -10px -10px 40px rgba(109, 119, 150, 0.15),
            15px 25px 40px rgba(0, 0, 0, 0.15),
            -5px -5px 20px rgba(255, 255, 255, 0.4)
          `,
          border: '1px solid rgba(255, 255, 255, 0.4)',
        }}
      >
        <div className="absolute top-[15%] left-[18%] w-[25%] h-[15%] bg-gradient-to-br from-white to-transparent rounded-[50%] blur-[1px] opacity-90 rotate-[-45deg] pointer-events-none" />
        <div className="absolute top-[18%] left-[15%] w-[6%] h-[6%] rounded-full bg-white blur-[0.5px] opacity-95 pointer-events-none" />
        <div className="absolute bottom-[15%] right-[15%] w-[15%] h-[8%] rounded-[50%] bg-white blur-[6px] opacity-40 rotate-[-45deg] pointer-events-none" />
      </div>
    </div>
  );
};