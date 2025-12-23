// src/components/ServicesSection.jsx - UPDATED TO USE SUPABASE
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Palette,
  Code,
  Smartphone,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { servicesAPI } from "../../api/supabase";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const ServicesSection = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef();
  const headerRef = useRef();
  const cardsRef = useRef();
  const bottomCtaRef = useRef();
  const securityBadgeRef = useRef();

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getActive(); // Only get active services
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
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");

  const handleServiceInquiry = (serviceTitle) => {
    const slug = slugify(serviceTitle);
    navigate(`/${slug}`);
  };

  // GSAP animations
  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.set(headerRef.current?.children || [], {
        opacity: 0,
        y: 50,
      });

      gsap.set(cardsRef.current?.children || [], {
        opacity: 0,
        y: 80,
        scale: 0.9,
      });

      gsap.set([securityBadgeRef.current, bottomCtaRef.current], {
        opacity: 0,
        y: 40,
      });

      ScrollTrigger.create({
        trigger: headerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(headerRef.current?.children || [], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
          });
        },
      });

      ScrollTrigger.create({
        trigger: cardsRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(cardsRef.current?.children || [], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.4)",
          });
        },
      });

      ScrollTrigger.create({
        trigger: securityBadgeRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to([securityBadgeRef.current, bottomCtaRef.current], {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: "power2.out",
          });
        },
      });

      const cards = gsap.utils.toArray(cardsRef.current?.children || []);
      cards.forEach((card) => {
        const icon = card.querySelector(".service-icon");
        const hoverOverlay = card.querySelector(".hover-overlay");
        const ctaButton = card.querySelector(".cta-button");
        const features = card.querySelectorAll(".feature-item");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.3,
            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1.1,
              rotationY: 15,
              duration: 0.4,
              ease: "back.out(1.7)",
            });
          }

          if (hoverOverlay) {
            gsap.to(hoverOverlay, {
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          if (ctaButton) {
            gsap.to(ctaButton, {
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          gsap.to(features, {
            x: 5,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotationY: 0,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          if (hoverOverlay) {
            gsap.to(hoverOverlay, {
              opacity: 0,
              duration: 0.4,
              ease: "power2.out",
            });
          }

          if (ctaButton) {
            gsap.to(ctaButton, {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }

          gsap.to(features, {
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, services.length]);

  if (loading) {
    return (
      <section
        id="services"
        className="relative py-20 bg-background overflow-hidden"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-chart-1 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-20 bg-background overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-chart-1/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Enhanced header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-chart-1/10 border border-chart-1/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-chart-1" />
            <span className="text-chart-1 text-sm font-medium">
              What I Offer
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            My{" "}
            <span className="bg-gradient-to-r from-chart-1 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Services
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From creative design to secure development, I offer comprehensive
            digital solutions that help your business thrive in the modern
            landscape.
          </p>
        </div>

        {/* Enhanced service cards */}
        {services.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No Services Available
            </h3>
            <p className="text-muted-foreground">
              Check back soon for our service offerings!
            </p>
          </div>
        ) : (
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:border-chart-1/30 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Hover overlay */}
                <div className="hover-overlay absolute inset-0 bg-gradient-to-br from-chart-1/5 via-purple-500/5 to-transparent opacity-0 pointer-events-none rounded-2xl"></div>

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chart-1/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"></div>

                {/* Service Icon */}
                <div className="mb-6 relative">
                  <div className="service-icon w-16 h-16 bg-gradient-to-br from-chart-1/20 to-purple-500/20 border border-chart-1/30 rounded-xl flex items-center justify-center text-chart-1 mb-4 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-chart-1/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      {iconMap[service.icon] || iconMap.code}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-chart-1 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Service Features */}
                <div className="mb-8">
                  <h4 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-chart-1 to-purple-500 rounded"></div>
                    What's Included:
                  </h4>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="feature-item flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      >
                        <div className="w-2 h-2 bg-gradient-to-r from-chart-1 to-purple-500 rounded-full flex-shrink-0"></div>
                        <span className="flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-border/50 relative">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-purple-400 bg-clip-text text-transparent">
                      {service.starting_price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {service.duration}
                    </div>
                  </div>

                  <button
                    onClick={() => handleServiceInquiry(service.title)}
                    className="cta-button btn-cta group/btn rounded-2xl"
                  >
                    Get Started
                    <ArrowRight
                      size={16}
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </button>
                </div>

                {/* Card index indicator */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-chart-1/10 border border-chart-1/20 rounded-full flex items-center justify-center text-chart-1 text-sm font-medium">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced security badge */}
        <div ref={securityBadgeRef} className="flex justify-center mb-12">
          <div className="sm:inline-flex items-center px-8 py-4 bg-card/60 backdrop-blur-sm border border-border/50 max-[460px]:flex max-[460px]:flex-col max-[460px]:text-center gap-4 sm:rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <Shield className="w-6 h-6 text-chart-1 sm:mr-4" />
              <div className="absolute -inset-1 bg-chart-1/20 rounded-full blur opacity-75"></div>
            </div>
            <span className="text-foreground font-medium">
              All projects include security best practices and ongoing support
            </span>
            <div className="ml-4 px-3 py-1 bg-chart-1/10 border border-chart-1/20 rounded-full text-chart-1 text-xs font-medium">
              100% Secure
            </div>
          </div>
        </div>

        {/* Enhanced Custom Service CTA */}
        <div ref={bottomCtaRef} className="text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-gradient-to-r from-chart-1/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-75"></div>
            <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Need Something Custom?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Let's discuss your unique requirements and create something
                amazing together.
              </p>
              <button
                onClick={() => handleServiceInquiry("Custom Project")}
                className="btn-custom group"
              >
                Start Custom Project
                <Sparkles className="inline-block w-4 h-4 ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
