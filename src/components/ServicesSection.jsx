import React from "react";
import { Link, useNavigate } from "react-router-dom"; // <-- import
import { Palette, Code, Smartphone, Shield, ArrowRight } from "lucide-react";
import { services } from "../data/mock";

const ServicesSection = () => {
  const navigate = useNavigate();

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

  return (
    <section id="services" className="py-20 bg-">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            My{" "}
            <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
            From creative design to secure development, I offer comprehensive
            digital solutions that help your business thrive in the modern
            landscape.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-secondary-background/50 border border-white/10 p-8 hover:border-[#00FFD1]/30 transition-all duration-500 hover:-translate-y-2 text-secondary-foreground shadow-lg cursor-target"
            >
              {/* Service Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center text-chart-1 mb-4 group-hover:chart-1/10 transition-all duration-300">
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-2xl font-bold text-secondary-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-secondary-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Service Features */}
              <div className="mb-8">
                <h4 className="text-secondary-foreground font-semibold mb-3">
                  What's Included:
                </h4>
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-secondary-foreground"
                    >
                      <div className="w-1.5 h-1.5 chart-1 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pricing & CTA */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl font-bold text-chart-1">
                    {service.startingPrice}
                  </div>
                  <div className="text-sm text-secondary-foreground">
                    {service.duration}
                  </div>
                </div>
                <button
                  onClick={() => handleServiceInquiry(service.title)}
                  className="btn-primary bg-chart-1 group flex items-center gap-2 px-6 py-3"
                >
                  Get Started
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Additional Service Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3  border border-white/10 shadow-lg">
            <Shield className="w-5 h-5 text-chart-1 mr-3" />
            <span className="text-secondary-foreground ">
              All projects include security best practices and ongoing support
            </span>
          </div>
        </div>

        {/* Custom Service CTA */}
        <div className="mt-12 text-center">
          <p className="text-secondary-foreground mb-6">
            Need something custom? Let's discuss your unique requirements.
          </p>
          <button
            onClick={() => handleServiceInquiry("Custom Project")}
            className="btn-secondary ring-2 ring-ring"
          >
            Start Custom Project
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
