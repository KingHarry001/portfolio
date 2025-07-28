import React from "react";
import { Code, Palette, Shield, Zap } from "lucide-react";
import { personalInfo, skills, certifications } from "../data/mock";

const AboutSection = () => {
  const skillCategories = [
    {
      title: "Design Excellence",
      icon: <Palette className="w-6 h-6" />,
      skills: skills.design,
      // color: "",
    },
    {
      title: "Development Power",
      icon: <Code className="w-6 h-6" />,
      skills: skills.development,
      // color: "#6FD2C0",
    },
    {
      title: "Emerging Technologies",
      icon: <Shield className="w-6 h-6" />,
      skills: skills.emerging,
      // color: "#40E0D0",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background text-left">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-5xl font-bold text-foreground mb-6">
                About{" "}
                <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
                  Me
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
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

            {/* Profile Image with Decorative Elements */}
            <div className="relative">
              <div className="w-64 h-64 mx-auto lg:mx-0">
                <div className="relative overflow-hidden">
                  <img
                    src={personalInfo.profileImage}
                    alt={personalInfo.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-1/20 to-transparent"></div>
                </div>
                {/* Decorative Border */}
                <div className="absolute -inset-4 bg-gradient-to-r from-chart-1/20 via-transparent to-[#00FFD1]/20 -z-10 blur-xl"></div>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">
                Recent Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 hover:border-[#00FFD1]/30 transition-all duration-300 bg-card text-card-foreground border border-border shadow-lg"
                  >
                    <div>
                      <div className="font-medium text-foreground ">
                        {cert.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.year}
                      </div>
                    </div>
                    <Zap className="w-5 h-5 text-chart-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Skills */}
          <div className="space-y-8">
            {skillCategories.map((category, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-2  bg-card border border-border shadow-lg text-chart-1"
                    style={{ color: category.color }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground ">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-chart-1 to-[#6FD2C0] transition-all duration-1000 ease-out"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Experience Highlights */}
            <div className="mt-12 p-6 bg-gradient-to-br from-white/5 to-[#00FFD1]/5 bg-card text-card-foreground border border-border shadow-lg">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Journey Highlights
              </h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 chart-1 rounded-full mt-2"></div>
                  <p>
                    Started as a graphic designer, evolved into full-stack
                    development
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 chart-1 rounded-full mt-2"></div>
                  <p>
                    Currently pursuing cybersecurity certifications to expand
                    expertise
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 chart-1 rounded-full mt-2"></div>
                  <p>Passionate about crypto and emerging web technologies</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
