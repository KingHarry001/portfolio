import React, { useEffect, useRef, useState } from "react";
import { Users, Code, TrendingUp, Clock, Zap, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StatsSection = () => {
  const sectionRef = useRef(null);
  const [animatedValues, setAnimatedValues] = useState({
    years: 0,
    projects: 0,
    users: 0,
    commits: 0
  });

  const stats = [
    {
      id: 1,
      targetValue: 5,
      label: "Years Experience",
      description: "Building scalable solutions",
      icon: <Clock className="w-6 h-6" />,
      color: "chart-1",
      suffix: "+"
    },
    {
      id: 2,
      targetValue: 25,
      label: "Projects Delivered",
      description: "Across various industries",
      icon: <Code className="w-6 h-6" />,
      color: "chart-2",
      suffix: "+"
    },
    {
      id: 3,
      targetValue: 10000,
      label: "Users Impacted",
      description: "Through digital solutions",
      icon: <Users className="w-6 h-6" />,
      color: "chart-3",
      suffix: "+"
    },
    {
      id: 4,
      targetValue: 3000,
      label: "Code Commits",
      description: "Continuous development",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "chart-4",
      suffix: "+"
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(sectionRef.current?.querySelectorAll('.stat-card'), {
        opacity: 0,
        y: 60,
        scale: 0.9
      });

      gsap.set(sectionRef.current?.querySelectorAll('.section-title, .section-subtitle'), {
        opacity: 0,
        y: 30
      });

      // Animate section header
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(sectionRef.current?.querySelectorAll('.section-title, .section-subtitle'), {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      })
      .to(sectionRef.current?.querySelectorAll('.stat-card'), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.4)",
        onComplete: () => {
          // Start counter animations after cards appear
          animateCounters();
        }
      }, "-=0.4");

      // Animate counters - FIXED VERSION
      const animateCounters = () => {
        stats.forEach((stat, index) => {
          // Create individual counter animations
          gsap.to({}, {
            duration: 2.5,
            delay: index * 0.3,
            ease: "power3.out",
            onUpdate: function() {
              const progress = this.progress();
              const currentValue = Math.floor(progress * stat.targetValue);
              
              // Update the specific counter value
              setAnimatedValues(prev => {
                const key = getStatKey(stat.label);
                if (prev[key] !== currentValue) {
                  return {
                    ...prev,
                    [key]: currentValue
                  };
                }
                return prev;
              });
            },
            onComplete: () => {
              // Ensure we reach the exact target value
              const key = getStatKey(stat.label);
              setAnimatedValues(prev => ({
                ...prev,
                [key]: stat.targetValue
              }));
            }
          });
        });
      };

      // Helper function to convert label to key
      const getStatKey = (label) => {
        const mapping = {
          "Years Experience": "years",
          "Projects Delivered": "projects",
          "Users Impacted": "users",
          "Code Commits": "commits"
        };
        return mapping[label] || label.toLowerCase().replace(/\s+/g, '_');
      };

      // Floating animation for stats
      stats.forEach((_, index) => {
        const card = sectionRef.current?.querySelectorAll('.stat-card')[index];
        if (card) {
          gsap.to(card, {
            y: -8,
            duration: 2 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2
          });
        }
      });

      // Sparkle animations
      gsap.to(sectionRef.current?.querySelectorAll('.sparkle'), {
        scale: 1.2,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut"
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Format number with comma separator
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Get display value for each stat
  const getDisplayValue = (stat) => {
    const key = {
      "Years Experience": "years",
      "Projects Delivered": "projects",
      "Users Impacted": "users",
      "Code Commits": "commits"
    }[stat.label];
    
    const value = animatedValues[key] || 0;
    
    if (stat.label === "Users Impacted" && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k${stat.suffix}`;
    }
    if (stat.label === "Code Commits" && value >= 1000) {
      return `${(value / 1000).toFixed(0)}k${stat.suffix}`;
    }
    return `${value}${stat.suffix}`;
  };

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-background to-gray-900/30 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gradient-to-r from-chart-1/10 to-chart-2/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-gradient-to-r from-chart-3/10 to-chart-4/10 rounded-full blur-3xl opacity-30" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute -inset-3 bg-chart-1/20 rounded-full blur-md" />
              <Zap className="w-8 h-8 text-chart-1 relative z-10" />
            </div>
            <h2 className="section-title text-4xl lg:text-5xl font-bold text-foreground">
              By The{" "}
              <span className="bg-gradient-to-r from-chart-1 via-chart-3 to-chart-5 bg-clip-text text-transparent">
                Numbers
              </span>
            </h2>
          </div>
          <p className="section-subtitle text-lg text-muted-foreground max-w-2xl mx-auto">
            Quantifying impact through measurable achievements and continuous growth
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="stat-card group relative"
            >
              {/* Card Background - Using style attribute for dynamic colors */}
              <div 
                className="absolute inset-0 border rounded-2xl backdrop-blur-sm transition-all duration-500 group-hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, 
                    var(--${stat.color}-rgb, 0, 184, 217, 0.1), 
                    var(--${stat.color}-rgb, 45, 212, 191, 0.05)
                  )`,
                  borderColor: `rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.2)`
                }}
              />

              {/* Animated Border */}
              <div 
                className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, 
                    var(--${stat.color}), 
                    rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.5), 
                    var(--${stat.color})
                  )`
                }}
              />

              {/* Card Content */}
              <div className="relative p-8">
                {/* Icon with glow */}
                <div className="relative mb-6 inline-block">
                  <div 
                    className="absolute -inset-3 rounded-full blur-md group-hover:blur-lg transition-all duration-500"
                    style={{ backgroundColor: `rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.2)` }}
                  />
                  <div 
                    className="relative w-16 h-16 border rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.2), 
                        rgba(var(--${stat.color}-rgb, 45, 212, 191), 0.1)
                      )`,
                      borderColor: `rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.2)`
                    }}
                  >
                    <div 
                      className="group-hover:scale-110 transition-transform duration-500"
                      style={{ color: `var(--${stat.color})` }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  
                  {/* Sparkle effects */}
                  <div className="sparkle absolute -top-2 -right-2 w-3 h-3 bg-white rounded-full blur-sm opacity-60" />
                  <div className="sparkle absolute -bottom-2 -left-2 w-2 h-2 bg-white rounded-full blur-sm opacity-60" />
                </div>

                {/* Counter Value - FIXED DISPLAY */}
                <div className="mb-3">
                  <div className="flex items-end gap-1">
                    <span 
                      className="text-4xl lg:text-5xl font-bold leading-none"
                      style={{ color: `var(--${stat.color})` }}
                    >
                      {getDisplayValue(stat)}
                    </span>
                    <Sparkles 
                      className="w-5 h-5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ color: `var(--${stat.color})` }}
                    />
                  </div>
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                  {stat.description}
                </p>

                {/* Progress Indicator */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: '0%',
                        background: `linear-gradient(90deg, 
                          var(--${stat.color}), 
                          rgba(var(--${stat.color}-rgb, 0, 184, 217), 0.6)
                        )`
                      }}
                      onAnimationStart={(e) => {
                        // Animate progress bar
                        setTimeout(() => {
                          e.target.style.width = '100%';
                        }, index * 300);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-muted-foreground mb-6">
            <span className="text-chart-1 font-medium">Every number tells a story</span> – Let's write the next chapter together
          </p>
          <button className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-chart-1 to-chart-3 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-chart-1/30 transition-all duration-300 hover:scale-105">
            <span>Let's Work Together</span>
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;