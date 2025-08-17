import React, { useEffect, useRef } from "react";
import { Code, Palette, Shield, Zap, Award, TrendingUp } from "lucide-react";
import { personalInfo, skills, certifications } from "../data/mock";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef(null);
  const aboutTextRef = useRef(null);
  const profileImageRef = useRef(null);
  const skillsRef = useRef(null);
  const certificationsRef = useRef(null);
  const journeyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - set elements to invisible
      gsap.set([aboutTextRef.current, profileImageRef.current], { 
        opacity: 0,
        y: 50 
      });

      gsap.set(skillsRef.current.children, { 
        opacity: 0, 
        y: 60,
        scale: 0.9
      });

      gsap.set([certificationsRef.current, journeyRef.current], { 
        opacity: 0, 
        x: -30 
      });

      // About Me and Image Animation
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          toggleActions: "play none none reverse"
        }
      });

      tl1.to(aboutTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out"
      })
      .to(profileImageRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        rotate: 360,
        scale: 1.1
      }, "-=0.7")
      .to(profileImageRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      });

      // Skills Animation
      gsap.timeline({
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      }).to(skillsRef.current.children, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.4)"
      });

      // Animate skill bars with delay
      const skillBars = skillsRef.current.querySelectorAll('[data-skill-bar]');
      skillBars.forEach((bar, index) => {
        const targetWidth = bar.getAttribute('data-skill-level');
        gsap.fromTo(bar, 
          { width: '0%' },
          {
            width: `${targetWidth}%`,
            duration: 1.5,
            delay: index * 0.1 + 0.5,
            ease: "power2.out",
            scrollTrigger: {
              trigger: bar,
              start: "top 90%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Certifications and Journey Animation
      gsap.timeline({
        scrollTrigger: {
          trigger: certificationsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }).to([certificationsRef.current, journeyRef.current], {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power3.out"
      });

      // Individual certification cards animation
      const certCards = certificationsRef.current.querySelectorAll('[data-cert-card]');
      gsap.fromTo(certCards,
        { opacity: 0, scale: 0.8, rotateY: -15 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: certificationsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Journey highlights animation
      const journeyCards = journeyRef.current.querySelectorAll('[data-journey-card]');
      gsap.fromTo(journeyCards,
        { opacity: 0, x: 30, scale: 0.9 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: journeyRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Hover animations for interactive elements
      const cards = sectionRef.current.querySelectorAll('[data-hover-card]');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const skillCategories = [
    {
      title: "Design Excellence",
      icon: <Palette className="w-6 h-6" />,
      skills: skills.design,
    },
    {
      title: "Development Power",
      icon: <Code className="w-6 h-6" />,
      skills: skills.development,
    },
    {
      title: "Emerging Technologies",
      icon: <Shield className="w-6 h-6" />,
      skills: skills.emerging,
    },
  ];

  const highlights = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Started as a graphic designer, evolved into full-stack development"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Currently pursuing cybersecurity certifications to expand expertise"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Passionate about crypto and emerging web technologies"
    }
  ];

  return (
    <section id="about" className="py-24 bg-background" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header & Profile Section Side by Side */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left - About Me Text */}
          <div className="space-y-8" ref={aboutTextRef}>
            <h2 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
                Me
              </span>
            </h2>
            <div className="space-y-6">
              <p className="text-xl text-muted-foreground leading-relaxed">
                I'm a passionate creative technologist who bridges the gap
                between stunning design and cutting-edge development. With over
                3 years of experience, I've helped startups and established
                companies bring their digital visions to life.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Currently expanding my expertise into cybersecurity and AI
                integration, I'm always exploring the intersection of creativity
                and emerging technologies like blockchain and Web3.
              </p>
            </div>
          </div>

          {/* Right - Profile Image */}
          <div className="flex justify-center lg:justify-end" ref={profileImageRef}>
            <div className="relative">
              <div className="w-80 h-80">
                <div className="relative overflow-hidden rounded-2xl cursor-target group">
                  <img
                    src='../King.jpg'
                    alt={personalInfo.name}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-1/20 to-transparent"></div>
                </div>
                {/* Decorative Border */}
                <div className="absolute -inset-6 bg-gradient-to-r from-chart-1/20 via-transparent to-[#00FFD1]/20 -z-10 blur-xl rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-24" ref={skillsRef}>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Skills & Expertise</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A diverse skill set spanning creative design, technical development, and emerging technologies
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {skillCategories.map((category, index) => (
              <div key={index} className="space-y-8" data-hover-card>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-chart-1/20 to-chart-1/10 border border-chart-1/20 rounded-2xl mb-4">
                    <div className="text-chart-1">
                      {category.icon}
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-foreground">
                    {category.title}
                  </h4>
                </div>

                <div className="space-y-6">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm font-semibold text-chart-1">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-chart-1 to-[#6FD2C0] rounded-full transition-all duration-1000 ease-out"
                          data-skill-bar
                          data-skill-level={skill.level}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Certifications and Highlights */}
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Certifications */}
          <div className="space-y-8" ref={certificationsRef}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-chart-1" />
                <h3 className="text-2xl font-bold text-foreground">
                  Recent Certifications
                </h3>
              </div>
              <p className="text-muted-foreground">
                Continuous learning and professional development
              </p>
            </div>
            
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="group p-6 bg-card border border-border rounded-xl hover:border-chart-1/30 transition-all duration-300 cursor-target hover:shadow-lg hover:shadow-chart-1/10"
                  data-cert-card
                  data-hover-card
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground group-hover:text-chart-1 transition-colors">
                        {cert.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.year}
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-chart-1 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Journey Highlights */}
          <div className="space-y-8" ref={journeyRef}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-chart-1" />
                <h3 className="text-2xl font-bold text-foreground">
                  Journey Highlights
                </h3>
              </div>
              <p className="text-muted-foreground">
                Key milestones in my professional evolution
              </p>
            </div>

            <div className="space-y-6">
              {highlights.map((highlight, index) => (
                <div 
                  key={index} 
                  className="group p-6 bg-gradient-to-br from-white/5 to-chart-1/5 border border-chart-1/20 rounded-xl hover:border-chart-1/30 transition-all duration-300 cursor-target"
                  data-journey-card
                  data-hover-card
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-chart-1/20 rounded-full flex items-center justify-center group-hover:bg-chart-1/30 transition-colors">
                      <div className="text-chart-1">
                        {highlight.icon}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                      {highlight.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;