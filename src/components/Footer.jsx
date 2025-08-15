import { useEffect, useState } from "react";
import { Heart, Github, Linkedin, Mail, Phone, Instagram } from "lucide-react";
import { personalInfo, socialLinks } from "../data/mock";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const roles = [
    "Web Developer",
    "Web Designer",
    "Cybersecurity Expert",
    "Founder",
    "Creator",
  ];

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [char, setChar] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index];
    const isEnd = char === current.length;
    const isStart = char === 0;

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setText(current.substring(0, char + 1));
          setChar((c) => c + 1);
          if (isEnd) setDeleting(true);
        } else {
          setText(current.substring(0, char - 1));
          setChar((c) => c - 1);
          if (isStart) {
            setDeleting(false);
            setIndex((prev) => (prev + 1) % roles.length);
          }
        }
      },
      isEnd ? 1000 : deleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [char, deleting, index]);

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

  const slugify = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");

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
              <h2 className="relative text-left text-xl lg:text-2xl text-muted-foreground font-medium">
                I'm a <span className="cursor-target"> </span>
                <span className="font-bold animate-pulse bg-gradient-to-r from-[#9c43fe] via-[#4cc2e9] to-[#1014cc] bg-clip-text text-transparent">
                  {text}
                </span>
                <span className="text-foreground animate-blink">|</span>
              </h2>
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
                className="p-2 bg-white/10 hover:chart-1/20 border cursor-target border-white/20 hover:border-[#00FFD1]/30 transition-all duration-300 hover:-translate-y-2"
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
                className="p-2 bg-white/10 hover:chart-1/20 border cursor-target border-white/20 hover:border-[#00FFD1]/30 transition-all duration-300 hover:-translate-y-2"
                title="LinkedIn"
              >
                <Linkedin
                  size={20}
                  className="text-muted-foreground hover:text-chart-1 transition-colors duration-300"
                />
              </a>
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 hover:chart-1/20 border cursor-target border-white/20 hover:border-[#00FFD1]/30 transition-all duration-300 hover:-translate-y-2"
                title="instagram"
              >
                <Instagram
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
                      onClick={() => navigate(`/${slugify(link.name)}`)}
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-[10vh] sm:pb-0">
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
                href="terms-of-service"
                className="hover:text-chart-1 transition-colors duration-300"
              >
                Terms of Service
              </button>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground text-sm max-[456px]:text-center">
              <span>
                Made with
                <Heart
                  size={16}
                  className="text-chart-1 animate-pulse inline mx-2"
                />
                Nexus dynasty studio
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
