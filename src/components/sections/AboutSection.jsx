import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowUpRight,
  Code,
  Cpu,
  Globe,
  Zap,
  Download,
  Award,
  TrendingUp,
  Shield,
  Palette,
  CheckCircle2,
  Terminal,
  Database,
} from "lucide-react";
import { skillsAPI, certificationsAPI } from "../../api/supabase"; // Keep your imports
import King from "../../assets/King.png";
import GlassCard from "../../components/GlassCard";

// --- 1. Spotlight Effect (Mouse Follower) ---
function Spotlight({ mouseX, mouseY }) {
  return (
    <motion.div
      className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-30"
      style={{
        background: useMotionTemplate`
          radial-gradient(
            650px circle at ${mouseX}px ${mouseY}px,
            rgba(14, 165, 233, 0.1),
            transparent 80%
          )
        `,
      }}
    />
  );
}

// --- 2. 3D Tilt Card ---
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative group/card ${className}`}
    >
      <div
        style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}
        className="absolute inset-4 rounded-3xl bg-chart-1/20 blur-2xl group-hover/card:bg-chart-1/30 transition-colors duration-500 -z-10"
      />
      {children}
    </motion.div>
  );
};

// --- 3. Main Component ---
const AboutSection = () => {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Data States
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data (Preserving your Supabase logic)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsData, certsData] = await Promise.all([
          skillsAPI.getAll(),
          certificationsAPI.getAll(),
        ]);
        setSkills(skillsData || []);
        setCertifications(certsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  // Group skills helper
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Icons Map
  const categoryIcons = {
    "Graphic Design": Palette,
    Frontend: Code,
    Backend: Database,
    Programming: Terminal,
    Security: Shield,
    Crypto: Shield,
    "AI/ML": Cpu,
  };

  if (loading)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-chart-1">
        Loading Assets...
      </div>
    );

  return (
    <section
      id="about"
      className="relative min-h-screen bg-black py-32 overflow-hidden selection:bg-chart-1/30"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#00000000,transparent),radial-gradient(circle_800px_at_50%_600px,#00000000,transparent)]" />
      <Spotlight mouseX={mouseX} mouseY={mouseY} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="mb-24 relative">
          {/* Big Outline Text Background */}
          <h1
            className="absolute -top-20 -left-10 text-[10rem] md:text-[15rem] font-black text-transparent opacity-5 select-none pointer-events-none"
            style={{ WebkitTextStroke: "2px #fff" }}
          >
            ABOUT
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <span className="text-chart-1 font-mono text-sm tracking-widest uppercase">
              // Who I Am
            </span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mt-4 tracking-tighter">
              Forging digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-blue-500">
                experiences.
              </span>
            </h2>
          </motion.div>
        </div>

        {/* --- CONTENT GRID --- */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
          {/* LEFT: TEXT & STATS (Span 7) */}
          <div className="lg:col-span-7 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-lg"
            >
              <p className="text-zinc-400 text-xl leading-relaxed">
                I am a{" "}
                <span className="text-white font-semibold">
                  Full Stack Developer
                </span>{" "}
                and <span className="text-white font-semibold">Designer</span>{" "}
                obsessed with performance and polish. I don't just write code; I
                craft interfaces that feel alive.
              </p>
              <p className="text-zinc-400 text-lg">
                From pixel-perfect UI design to secure, scalable backend
                architectures, I help brands navigate the digital landscape with
                confidence.
              </p>
            </motion.div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
              {[
                { label: "Years Experience", value: "03+", icon: Clock },
                { label: "Projects Shipped", value: "25+", icon: Code },
                { label: "Happy Clients", value: "100%", icon: Zap },
                { label: "Technologies", value: "15+", icon: Cpu },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-50 transition-opacity">
                    <stat.icon />
                  </div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-zinc-500 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <button
                onClick={() =>
                  document.getElementById("contact").scrollIntoView()
                }
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Let's Connect{" "}
                  <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-chart-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>

              <button className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-2">
                <Download size={18} /> Download CV
              </button>
            </div>
          </div>

          {/* RIGHT: 3D IMAGE (Span 5) */}
          <div className="lg:col-span-5 flex justify-center perspective-1000">
            <TiltCard className="w-full max-w-md aspect-[4/5]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
                {/* Image */}
                <img
                  src={King}
                  alt="Harrison King"
                  className="h-full w-full object-cover grayscale group-hover/card:grayscale-0 transition-all duration-700 scale-105 group-hover/card:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                {/* Floating Badge (3D Element) */}
                <div
                  style={{ transform: "translateZ(50px)" }}
                  className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-chart-1 flex items-center justify-center text-black">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Based in</p>
                      <p className="text-zinc-400 text-xs">
                        Lagos, Nigeria (GMT+1)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* --- SKILLS & EXPERTISE (Bento Grid) --- */}
        <div className="mb-24">
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-2xl font-bold text-white mb-8 flex items-center gap-2"
              >
                <Cpu className="text-chart-1" /> Technical Arsenal
              </motion.h3>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {Object.entries(groupedSkills).map(
                ([category, catSkills], idx) => {
                  const Icon = categoryIcons[category] || Code;
                  return (
                    <GlassCard
                      key={idx}
                      className="p-8 hover:bg-white/5 transition-colors tilt-card"
                    >
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/5 rounded-xl text-chart-1">
                          <Icon size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-white">
                          {category}
                        </h4>
                      </div>

                      <div className="space-y-6">
                        {catSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="group"
                            onMouseEnter={() => setActiveSkill(skill.name)}
                            onMouseLeave={() => setActiveSkill(null)}
                          >
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-zinc-400 group-hover:text-white transition-colors">
                                {skill.name}
                              </span>
                              <span className="text-chart-1">
                                {skill.level}%
                              </span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-chart-1 to-blue-500 rounded-full relative"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.level}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                              >
                                <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite]" />
                              </motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* --- CERTS & JOURNEY (Split Layout) --- */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl font-bold text-white flex items-center gap-2"
            >
              <Award className="text-chart-1" /> Certifications
            </motion.h3>

            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900/40 border border-white/5 hover:border-chart-1/30 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-chart-1/10 flex items-center justify-center text-chart-1 group-hover:scale-110 transition-transform">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:text-chart-1 transition-colors">
                      {cert.name}
                    </h4>
                    <p className="text-zinc-500 text-sm">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                  <CheckCircle2
                    className="ml-auto text-green-500 opacity-50 group-hover:opacity-100 transition-opacity"
                    size={18}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Journey Highlights */}
          <div className="space-y-8">
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-2xl font-bold text-white flex items-center gap-2"
            >
              <TrendingUp className="text-purple-500" /> Journey
            </motion.h3>

            <div className="relative p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/50 to-black overflow-hidden">
              {/* Background texture */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />

              <div className="relative z-10 space-y-8">
                {[
                  {
                    text: "Evolved from Graphic Design to Full Stack Architecture.",
                    icon: Palette,
                  },
                  {
                    text: "Building secure, decentralized applications.",
                    icon: Code,
                  },
                  {
                    text: "Exploring the frontiers of AI & Cybersecurity.",
                    icon: Zap,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                    </div>
                    <p className="text-zinc-300 text-lg leading-relaxed">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(500%);
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

// Helper Icon for stats
const Clock = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default AboutSection;
