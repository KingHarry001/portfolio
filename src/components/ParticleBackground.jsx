import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const ParticleBackground = React.forwardRef(({ 
  particleCount = 50,
  colors = ["#00FFD1", "#4ADE80", "#3B82F6", "#8B5CF6", "#F59E0B"]
}, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
        this.waveOffset = Math.random() * Math.PI * 2;
      }

      update(mouse) {
        // Wave motion
        this.waveOffset += 0.05;
        this.x += Math.sin(this.waveOffset) * 0.5 + this.speedX;
        this.y += Math.cos(this.waveOffset) * 0.5 + this.speedY;

        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance) {
            const angle = Math.atan2(dy, dx);
            const force = (maxDistance - distance) / maxDistance;
            this.x -= Math.cos(angle) * force * 5;
            this.y -= Math.sin(angle) * force * 5;
          }
        }

        // Bounce off edges
        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        else if (this.y < 0) this.y = height;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.size,
          this.x, this.y, this.size * 3
        );
        gradient.addColorStop(0, this.color + "80");
        gradient.addColorStop(1, this.color + "00");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create particles
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

    // Mouse position
    const mouse = { x: null, y: null };
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mouse);
        particle.draw();
      });

      // Draw connections
      particlesRef.current.forEach((particle, i) => {
        particlesRef.current.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color + Math.min(0.3, 0.3 * (1 - distance / maxDistance));
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    animate();

    // Parallax effect
    if (ref) {
      gsap.to(canvas, {
        y: 100,
        scrollTrigger: {
          scrub: true,
        },
        ease: "none",
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [particleCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
});

ParticleBackground.displayName = "ParticleBackground";

export default ParticleBackground;