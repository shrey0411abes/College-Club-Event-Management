"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Async check to prevent cascading render warnings
    const timer = setTimeout(() => {
      setMotionAllowed(!mediaQuery.matches);
    }, 0);

    const handler = (e) => setMotionAllowed(!e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  // Global mouse & scroll tracking for parallax and cursor spotlight
  useEffect(() => {
    if (!motionAllowed) return;

    let ticking = false;
    let scrollY = 0;

    const handleScroll = () => {
      scrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.setProperty("--scroll-y", `${scrollY}px`);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handlePointerMove = (e) => {
      if (containerRef.current) {
        containerRef.current.style.setProperty("--mouse-x", `${e.clientX}px`);
        containerRef.current.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [motionAllowed]);

  // Quantum Constellation Canvas with Interactive Gravity and Shockwave Ripples
  useEffect(() => {
    if (!motionAllowed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let particles = [];
    let ripples = [];
    const mouse = { x: -2000, y: -2000, targetX: -2000, targetY: -2000 };

    const colorPalettes = [
      { r: 99, g: 102, b: 241 }, // Indigo
      { r: 168, g: 85, b: 247 }, // Purple
      { r: 6, g: 182, b: 212 },  // Cyan
      { r: 245, g: 158, b: 11 }, // Amber
    ];

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handlePointerLeave = () => {
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: Math.min(width, height) * 0.35,
        opacity: 0.6,
        growth: 4.5,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handleClick, { passive: true });

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const isMobile = width < 768;
      const count = isMobile ? 24 : Math.min(70, Math.floor(width / 22));

      particles = [];
      for (let i = 0; i < count; i++) {
        const palette = colorPalettes[i % colorPalettes.length];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          baseRadius: Math.random() * 1.5 + 0.8,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
          color: palette,
        });
      }
    };

    initCanvas();
    window.addEventListener("resize", initCanvas);

    let lastTime = performance.now();

    const draw = (currentTime) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Smooth cursor lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      ctx.clearRect(0, 0, width, height);

      // Update & Draw Shockwave Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.growth;
        r.opacity *= 0.96;

        if (r.opacity < 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${r.opacity * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Draw & Connect Particles
      const maxConnectDistSq = 16000; // ~126px

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Harmonic oscillation
        p.pulsePhase += p.pulseSpeed;
        const radius = p.baseRadius + Math.sin(p.pulsePhase) * 0.4;

        // Base velocity update
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        // Screen boundary wrap
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        // Interaction: Gentle gravitational swirl / repulsion near pointer
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 140;

        if (distSq < influenceRadius * influenceRadius && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (influenceRadius - dist) / influenceRadius;
          // Gentle tangent swirl + outward push
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2.2;
          p.y += Math.sin(angle) * force * 2.2;
        }

        // Ripple interaction: push particles outward as shockwave passes
        for (let k = 0; k < ripples.length; k++) {
          const rip = ripples[k];
          const rx = p.x - rip.x;
          const ry = p.y - rip.y;
          const rDist = Math.sqrt(rx * rx + ry * ry);
          const diff = Math.abs(rDist - rip.radius);
          if (diff < 30) {
            const push = (1 - diff / 30) * rip.opacity * 3;
            p.x += (rx / (rDist || 1)) * push;
            p.y += (ry / (rDist || 1)) * push;
          }
        }

        // Draw particle with luminous core
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(radius, 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.65)`;
        ctx.shadowColor = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset for lines

        // Inter-particle filament connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const cdx = p.x - p2.x;
          const cdy = p.y - p2.y;
          const cdistSq = cdx * cdx + cdy * cdy;

          if (cdistSq < maxConnectDistSq) {
            const alpha = (1 - Math.sqrt(cdistSq) / 126.5) * 0.22;
            const grad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`);
            grad.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", initCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handleClick);
    };
  }, [motionAllowed]);

  if (!motionAllowed) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 pointer-events-none bg-[#090d16]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#090d16] to-[#090d16]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-[#090d16]"
      style={{
        "--scroll-y": "0px",
        "--mouse-x": "-2000px",
        "--mouse-y": "-2000px",
      }}
    >
      <style>{`
        .bg-aurora-blob-1 {
          animation: aurora-orbit-1 32s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        .bg-aurora-blob-2 {
          animation: aurora-orbit-2 38s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate-reverse;
        }
        .bg-aurora-blob-3 {
          animation: aurora-orbit-3 44s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
        }
        .bg-aurora-blob-4 {
          animation: aurora-orbit-4 36s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate-reverse;
        }

        @keyframes aurora-orbit-1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(14vw, 8vh) scale(1.15) rotate(45deg); }
          100% { transform: translate(-8vw, 16vh) scale(0.92) rotate(90deg); }
        }
        @keyframes aurora-orbit-2 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          50% { transform: translate(-16vw, -10vh) scale(0.9) rotate(-60deg); }
          100% { transform: translate(12vw, 12vh) scale(1.12) rotate(-120deg); }
        }
        @keyframes aurora-orbit-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(10vw, -12vh) scale(1.2); }
          100% { transform: translate(-12vw, 6vh) scale(0.85); }
        }
        @keyframes aurora-orbit-4 {
          0% { transform: translate(0, 0) scale(0.95); }
          50% { transform: translate(-8vw, 14vh) scale(1.1); }
          100% { transform: translate(10vw, -8vh) scale(1.05); }
        }

        .bg-grid-parallax {
          transform: translateY(calc(var(--scroll-y) * -0.15));
        }

        @media (hover: hover) {
          .bg-chromatic-spotlight {
            background: radial-gradient(
              650px circle at var(--mouse-x) var(--mouse-y),
              rgba(99, 102, 241, 0.12) 0%,
              rgba(6, 182, 212, 0.06) 35%,
              transparent 70%
            );
          }
        }
      `}</style>

      {/* Layer 1: Vivid Cosmic Aurora Currents */}
      <div className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vh] bg-gradient-to-tr from-indigo-600/25 via-indigo-500/15 to-transparent rounded-full blur-[110px] bg-aurora-blob-1" />
      <div className="absolute top-[15%] -right-[15%] w-[60vw] h-[60vh] bg-gradient-to-bl from-purple-600/20 via-violet-500/15 to-transparent rounded-full blur-[110px] bg-aurora-blob-2" />
      <div className="absolute -bottom-[15%] left-[15%] w-[70vw] h-[60vh] bg-gradient-to-r from-cyan-600/15 via-indigo-600/10 to-transparent rounded-full blur-[120px] bg-aurora-blob-3" />
      <div className="absolute top-[45%] left-[30%] w-[50vw] h-[50vh] bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-[130px] bg-aurora-blob-4" />

      {/* Layer 2: Subtle Cybernetic Grid with Radial Vignette */}
      <div
        className="absolute inset-0 bg-grid-parallax"
        style={{
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px, 144px 144px, 144px 144px",
          maskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 25%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 45%, #000 25%, transparent 100%)",
        }}
      />

      {/* Layer 3: Floating Ambient Cyber Glyphs */}
      <div className="absolute inset-0 select-none overflow-hidden opacity-30 text-[11px] font-mono font-bold text-indigo-300">
        <span className="absolute top-[18%] left-[8%] animate-float-slow">&lt;/&gt;</span>
        <span className="absolute top-[32%] right-[12%] animate-float-reverse text-amber-400">01</span>
        <span className="absolute top-[58%] left-[15%] animate-float-slow text-cyan-400">λ</span>
        <span className="absolute top-[75%] right-[20%] animate-float-reverse">{`{ }`}</span>
        <span className="absolute top-[82%] left-[45%] animate-float-slow text-violet-400">◈</span>
        <span className="absolute top-[25%] left-[80%] animate-float-reverse text-emerald-400">⚡</span>
      </div>

      {/* Layer 4: Interactive Quantum Constellation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Layer 5: Chromatic Interactive Spotlight */}
      <div className="absolute inset-0 bg-chromatic-spotlight hidden md:block" />

      {/* Layer 6: Vignette / Atmospheric Depth Filter */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/30 via-transparent to-[#090d16]/70" />
    </div>
  );
}
