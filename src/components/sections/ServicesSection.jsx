import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Code,
  Smartphone,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { servicesAPI } from "../../api/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getActive();
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const iconMap = {
    palette: <Palette className="w-8 h-8" />,
    code: <Code className="w-8 h-8" />,
    smartphone: <Smartphone className="w-8 h-8" />,
    shield: <Shield className="w-8 h-8" />,
  };

  const slugify = (text) =>
    text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

  const handleServiceInquiry = (serviceTitle) => {
    navigate(`/${slugify(serviceTitle)}`);
  };

  // GSAP Animations
  useEffect(() => {
    if (loading || services.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Initial Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      tl.from(".section-header > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      })
      .from(".service-card", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power4.out"
      }, "-=0.4");

      // 2. Individual Card Interactive States
      const cards = gsap.utils.toArray(".service-card");
      cards.forEach(card => {
        const features = card.querySelectorAll(".feature-item");
        const icon = card.querySelector(".service-icon");
        
        const hoverTl = gsap.timeline({ paused: true });
        hoverTl.to(card, { y: -10, borderColor: "rgba(var(--chart-1-rgb), 0.5)", duration: 0.3 })
               .to(icon, { rotationY: 180, scale: 1.1, duration: 0.5, ease: "back.out(2)" }, 0)
               .to(features, { x: 8, stagger: 0.05, duration: 0.2 }, 0);

        card.addEventListener("mouseenter", () => hoverTl.play());
        card.addEventListener("mouseleave", () => hoverTl.reverse());
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services]);

  if (loading) return <LoadingSkeleton />;

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className="relative py-24 bg-[#020617] overflow-hidden"
    >
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-chart-1/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="section-header text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chart-1/10 border border-chart-1/20 text-chart-1 text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" />
            <span>SOLUTIONS & EXPERTISE</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            High-Impact <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-blue-400">Services.</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            I build scalable, secure, and visually stunning digital products tailored to your business goals.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-10 hover:shadow-2xl hover:shadow-chart-1/10 transition-shadow duration-500 overflow-hidden"
            >
              {/* Subtle Animated Background Mesh */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-chart-1/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10">
                <div className="service-icon w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center text-chart-1 mb-8 shadow-inner">
                  {iconMap[service.icon] || iconMap.code}
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-10">
                  {service.description}
                </p>

                <div className="space-y-4 mb-12">
                  <h4 className="text-zinc-200 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    <div className="w-6 h-px bg-chart-1" />
                    Key Deliverables
                  </h4>
                  <ul className="grid grid-cols-1 gap-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="feature-item flex items-start gap-3 text-zinc-400">
                        <CheckCircle2 className="w-5 h-5 text-chart-1 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                  <div>
                    <span className="block text-zinc-500 text-xs font-bold uppercase mb-1">Starts from</span>
                    <span className="text-2xl font-black text-white">{service.starting_price}</span>
                  </div>
                  <button
                    onClick={() => handleServiceInquiry(service.title)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-chart-1 transition-colors group/btn"
                  >
                    Get Started
                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Trust Badge */}
        <div className="flex justify-center mb-24">
          <div className="flex items-center gap-6 px-10 py-5 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
            <div className="p-3 bg-chart-1/20 rounded-full">
              <Shield className="w-6 h-6 text-chart-1 animate-pulse" />
            </div>
            <p className="text-zinc-300 font-medium">
              Every build follows <span className="text-white font-bold">Industry Standard Security Protocols</span> & OWASP guidelines.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="relative rounded-[3rem] p-16 bg-gradient-to-br from-zinc-900 to-black border border-white/5 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <h3 className="text-4xl font-black text-white mb-6 relative z-10">
            Have a unique project in mind?
          </h3>
          <p className="text-zinc-400 text-xl max-w-xl mx-auto mb-10 relative z-10">
            I specialize in custom architectural solutions for high-scale enterprise applications.
          </p>
          <button
            onClick={() => handleServiceInquiry("Custom Project")}
            className="relative z-10 px-12 py-5 bg-chart-1 text-black font-black text-lg rounded-2xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--chart-1-rgb),0.3)]"
          >
            Request a Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

const LoadingSkeleton = () => (
  <div className="py-24 bg-[#020617] flex items-center justify-center min-h-[800px]">
    <div className="w-16 h-16 border-4 border-chart-1 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default ServicesSection;