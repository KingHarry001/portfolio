import React from "react";
import { Heart, Github, Linkedin, Mail, Phone } from "lucide-react";
import { personalInfo, socialLinks } from "../data/mock";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Services",
      links: [
        { name: "Graphic Design", href: "#services" },
        { name: "Web Development", href: "#services" },
        { name: "UI/UX Design", href: "#services" },
        { name: "Security Consulting", href: "#services" },
      ],
    },
    {
      title: "Projects",
      links: [
        { name: "Featured Work", href: "#projects" },
        { name: "Design Portfolio", href: "#projects" },
        { name: "Development Projects", href: "#projects" },
        { name: "Security Tools", href: "#projects" },
      ],
    },
    {
      title: "Learning",
      links: [
        { name: "Blog Articles", href: "#blog" },
        { name: "Cybersecurity", href: "#blog" },
        { name: "Web3 & Crypto", href: "#blog" },
        { name: "Development Tips", href: "#blog" },
      ],
    },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleQuickHire = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-muted border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand & Description */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {personalInfo.name}
              </h3>
              <p className="text-chart-1 font-medium mb-4">
                Creative Technologist
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bridging creativity with cutting-edge technology to deliver
                exceptional digital experiences.
              </p>
            </div>

            {/* Quick Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail size={16} className="text-chart-1" />
                <span className="text-sm">{personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone size={16} className="text-chart-1" />
                <span className="text-sm">{personalInfo.phone}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:chart-1/20 border border-white/20 hover:border-[#00FFD1]/30 transition-all duration-300"
                title="GitHub"
              >
                <Github
                  size={20}
                  className="text-muted-foreground hover:text-chart-1 transition-colors duration-300"
                />
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:chart-1/20 border border-white/20 hover:border-[#00FFD1]/30 transition-all duration-300"
                title="LinkedIn"
              >
                <Linkedin
                  size={20}
                  className="text-muted-foreground hover:text-chart-1 transition-colors duration-300"
                />
              </a>
            </div>
          </div>

          {/* Footer Navigation */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-foreground font-semibold mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="text-muted-foreground hover:text-chart-1 transition-colors duration-300"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Hire CTA */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="bg-gradient-to-r from-chart-1/10 to-transparent border border-[#00FFD1]/20 p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Let's collaborate and create something amazing together. From
              concept to completion, I'm here to bring your digital vision to
              life.
            </p>
            <button
              onClick={handleQuickHire}
              className="btn-primary bg-chart-1"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>
                © {currentYear} {personalInfo.name}. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <button
                onClick={() => alert("Privacy Policy would be displayed here")}
                className="hover:text-chart-1 transition-colors duration-300"
              >
                Privacy Policy
              </button>
              <button
                onClick={() =>
                  alert("Terms of Service would be displayed here")
                }
                className="hover:text-chart-1 transition-colors duration-300"
              >
                Terms of Service
              </button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-chart-1 animate-pulse" />
              <span>and cutting-edge tech</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
