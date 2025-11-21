'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeName } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type?: 'leaf' | 'petal' | 'rain' | 'snow' | 'star';
}

export const SeasonalEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const getRandomColor = (theme: ThemeName) => {
      switch (theme) {
        case 'spring': // Petals
          const pinks = ['rgba(255, 183, 178, 0.8)', 'rgba(255, 218, 218, 0.8)', 'rgba(255, 255, 255, 0.6)'];
          return pinks[Math.floor(Math.random() * pinks.length)];
        case 'autumn': // Leaves
          const autumns = ['rgba(234, 88, 12, 0.8)', 'rgba(217, 119, 6, 0.8)', 'rgba(180, 83, 9, 0.8)', 'rgba(251, 191, 36, 0.8)'];
          return autumns[Math.floor(Math.random() * autumns.length)];
        case 'summer': // Rain
          return 'rgba(173, 216, 230, 0.5)';
        case 'winter': // Snow
          return 'rgba(255, 255, 255, 0.8)';
        case 'dark': // Stars
          return `rgba(255, 255, 255, ${Math.random()})`;
        default:
          return 'rgba(255, 255, 255, 0.5)';
      }
    };

    const initParticles = () => {
      particles = [];
      const theme = currentTheme.name;
      let count = 0;

      // Configure count based on theme intensity
      if (theme === 'spring') count = 40;
      else if (theme === 'summer') count = 100;
      else if (theme === 'autumn') count = 50;
      else if (theme === 'winter') count = 80;
      else if (theme === 'dark') count = 60;

      for (let i = 0; i < count; i++) {
        particles.push(createParticle(theme, true));
      }
    };

    const createParticle = (theme: ThemeName, randomY = false): Particle => {
      const x = Math.random() * width;
      const y = randomY ? Math.random() * height : -20;
      
      switch (theme) {
        case 'spring': // Falling Petals
          return {
            x, y,
            vx: Math.random() * 1 - 0.5,
            vy: Math.random() * 1 + 1,
            size: Math.random() * 5 + 3,
            color: getRandomColor(theme),
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            opacity: 1,
            type: 'petal'
          };
        case 'summer': // Rain
          return {
            x, y,
            vx: 0, // Vertical drop
            vy: Math.random() * 10 + 15, // Fast
            size: Math.random() * 2 + 10, // Length of rain drop
            color: getRandomColor(theme),
            rotation: 0,
            rotationSpeed: 0,
            opacity: Math.random() * 0.3 + 0.1,
            type: 'rain'
          };
        case 'autumn': // Falling Leaves
          return {
            x, y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 1.5 + 1,
            size: Math.random() * 8 + 5,
            color: getRandomColor(theme),
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            opacity: 1,
            type: 'leaf'
          };
        case 'winter': // Snow
          return {
            x, y,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 1 + 0.5,
            size: Math.random() * 3 + 1,
            color: getRandomColor(theme),
            rotation: 0,
            rotationSpeed: 0,
            opacity: Math.random() * 0.5 + 0.5,
            type: 'snow'
          };
        case 'dark': // Static twinkling stars
        default:
          return {
             x: Math.random() * width,
             y: Math.random() * height,
             vx: Math.random() * 0.05 - 0.025,
             vy: Math.random() * 0.05 - 0.025,
             size: Math.random() * 1.5,
             color: getRandomColor('dark'),
             rotation: 0,
             rotationSpeed: Math.random() * 0.02,
             opacity: Math.random(),
             type: 'star'
          };
      }
    };

    const drawPetal = (p: Particle) => {
       ctx.save();
       ctx.translate(p.x, p.y);
       ctx.rotate((p.rotation * Math.PI) / 180);
       ctx.fillStyle = p.color;
       ctx.beginPath();
       // Draw an oval shape
       ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
       ctx.fill();
       ctx.restore();
    };

    const drawLeaf = (p: Particle) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Draw an elliptical shape for the leaf
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    };

    const drawRain = (p: Particle) => {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.size); // Vertical line
        ctx.stroke();
    };

    const drawSnow = (p: Particle) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    };

    const drawStar = (p: Particle) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(Math.sin(Date.now() * 0.001 + p.x))})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach((p, index) => {
        // Update Physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Special movement modifiers
        if (p.type === 'petal' || p.type === 'leaf') {
            p.x += Math.sin(p.y * 0.01) * 0.5; // Swaying
        }

        // Reset particles when they go off screen
        if (p.y > height + 20 || p.x < -20 || p.x > width + 20) {
            if (currentTheme.name !== 'dark') {
                 particles[index] = createParticle(currentTheme.name);
            } else {
                // For stars, just wrap around
                 if (p.y > height) p.y = 0;
                 if (p.x > width) p.x = 0;
                 if (p.x < 0) p.x = width;
            }
        }

        // Draw
        switch (p.type) {
            case 'petal': drawPetal(p); break;
            case 'leaf': drawLeaf(p); break;
            case 'rain': drawRain(p); break;
            case 'snow': drawSnow(p); break;
            case 'star': drawStar(p); break;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme.name]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};