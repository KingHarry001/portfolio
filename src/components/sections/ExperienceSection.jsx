import React, { useEffect, useRef } from "react";
import { 
  Briefcase, Calendar, MapPin, ExternalLink, 
  ChevronRight, Building, Award, Rocket, 
  Users, GraduationCap 
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// 1. DATA DEFINED OUTSIDE TO PREVENT REFERENCE ERRORS
const experiences = [
  {
    id: 1,
    title: "Senior Full Stack Developer (Contract, USA)",
    company: "ParcelTrack",
    location: "Remote (USA)",
    period: "Nov 2025 – Dec 2025",
    icon: <Rocket className="w-5 h-5" />,
    color: "blue",
    description: "Delivered ParcelTrack, a full-stack enterprise logistics & dispatch platform with a dual ecosystem.",
    achievements: [
      "Architected production-grade backend using Supabase PostgreSQL with RLS.",
      "Built SQL triggers to automate 100% of manual admin tasks.",
      "Designed real-time tracking engine using react-simple-maps."
    ],
    technologies: ["Next.js 16", "Supabase", "TailwindCSS v4", "Framer Motion"],
    link: "#"
  },
  {
    id: 2,
    title: "Lead Full Stack Engineer",
    company: "Seamless Auto Part",
    location: "Lagos, Nigeria",
    period: "Jan 2025 – Present",
    icon: <Building className="w-5 h-5" />,
    color: "emerald",
    description: "Architected an intelligent auto-parts marketplace with AI-powered recommendations.",
    achievements: [
      "Developed Smart Recommendation API boosting conversions by 30%.",
      "Migrated system to Next.js improving SEO and scalability."
    ],
    technologies: ["Next.js", "Node.js", "MongoDB", "Paystack API"],
    link: "#"
  },
  {
    id: 3,
    title: "Ex-Founder & CTO",
    company: "Attenda Africa",
    location: "Lagos, Nigeria",
    period: "May 2023 – Dec 2024",
    icon: <Award className="w-5 h-5" />,
    color: "amber",
    description: "Founded a geo-attendance platform adopted by government organizations.",
    achievements: [
      "Raised $10,000+ in funding and received AWS cloud credits.",
      "Integrated AI facial verification using Hugging Face."
    ],
    technologies: ["Next.js", "Supabase", "Hugging Face API", "Telegram API"],
    link: "#"
  }
];

// Tailwind Color Map for JIT support
const colorMap = {
  blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
};

const ExperienceSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card entry animations
      gsap.utils.toArray(".experience-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
        });
      });

      // Growing line animation
      gsap.to(".timeline-line-progress", {
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 70%",
          end: "bottom 70%",
          scrub: true,
        },
        height: "100%",
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="py-24 bg-background overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground">
            Work <span className="text-muted-foreground/30">Experience</span>
          </h2>
        </div>

        <div className="relative timeline-container">
          {/* Timeline Background Line */}
          <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 h-full w-px bg-border" />
          {/* Animated Progress Line */}
          <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 w-px bg-primary timeline-line-progress h-0 z-10" />

          <div className="space-y-20">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={exp.id} className={`relative flex flex-col lg:flex-row items-center experience-card ${isEven ? "lg:flex-row-reverse" : ""}`}>
                  {/* Date Side */}
                  <div className={`hidden lg:flex w-1/2 ${isEven ? "pl-16 justify-start" : "pr-16 justify-end"}`}>
                    <span className="text-sm font-mono text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                      {exp.period}
                    </span>
                  </div>

                  {/* Icon Marker */}
                  <div className="absolute left-6 lg:left-1/2 transform lg:-translate-x-1/2 flex items-center justify-center z-20">
                    <div className="w-4 h-4 rounded-full bg-background border-4 border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  </div>

                  {/* Card Side */}
                  <div className={`w-full lg:w-1/2 ml-14 lg:ml-0 ${isEven ? "lg:pr-16" : "lg:pl-16"}`}>
                    <div className="p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all shadow-sm">
                      <div className={`inline-flex p-3 rounded-xl mb-6 ${colorMap[exp.color]}`}>
                        {exp.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                      <div className="flex items-center gap-2 text-primary font-medium mb-4">
                        <Building size={16} /> <span>{exp.company}</span>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">{exp.description}</p>
                      <ul className="space-y-2">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <ChevronRight size={16} className="text-primary flex-shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;