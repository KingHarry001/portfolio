import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Calendar,
  ExternalLink,
  X,
  Github,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { personalInfo, socialLinks } from "../data/mock";
import BookingModal from "./BookingModal";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalendarBooking = () => {
    setIsBookingOpen(true);
  };

  const socialPlatforms = [
    { name: "GitHub", url: socialLinks.github, icon: <Github size={30} /> },
    {
      name: "LinkedIn",
      url: socialLinks.linkedin,
      icon: <Linkedin size={30} />,
    },
    {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: <Instagram size={30} />,
    },
    { name: "Twitter", url: socialLinks.twitter, icon: <Twitter size={30} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, company, service, message } = formData;

    // Format message
    const formattedMessage = `
Name: ${name}
Email: ${email}
Company: ${company || "N/A"}
Service: ${service}
Message: ${message}
  `;

    alert("Thank you for your message! I'll get back to you within 24 hours.");

    const encodedMessage = encodeURIComponent(formattedMessage);
    const phoneNumber = "2349038163213";

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");

    // Optional: Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto pl-3 pr-3 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Let's{" "}
            <span className="bg-gradient-to-r from-chart-1 to-foreground bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your digital vision to life? Let's discuss how I can
            help your project succeed with cutting-edge design and development.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                I'm always excited to work on new projects and collaborate with
                innovative teams. Whether you need design, development, or
                security consulting, I'm here to help.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-muted border border-white/10 hover:border-[#00FFD1]/30 transition-all duration-300 cursor-target">
                <div className="p-3 chart-1/10 border border-[#00FFD1]/30 text-chart-1">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground">{personalInfo.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Response within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted border border-white/10 hover:border-[#00FFD1]/30 transition-all duration-300 cursor-target">
                <div className="p-3 chart-1/10 border border-[#00FFD1]/30 text-chart-1">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                  <p className="text-muted-foreground">{personalInfo.phone}</p>
                  <p className="text-sm text-muted-foreground">
                    Available 9 AM - 6 PM PST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-muted border border-white/10 hover:border-[#00FFD1]/30 transition-all duration-300 cursor-target">
                <div className="p-3 chart-1/10 border border-[#00FFD1]/30 text-chart-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">
                    Location
                  </h4>
                  <p className="text-muted-foreground">
                    {personalInfo.location}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Open to remote collaboration
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Calendar Booking */}
            <div className="p-6 bg-gradient-to-br from-chart-1/10 to-transparent border border-[#00FFD1]/20">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-chart-1" />
                <h4 className="text-xl font-semibold text-foreground">
                  Schedule a Call
                </h4>
              </div>
              <p className="text-muted-foreground mb-4">
                Prefer to talk directly? Book a 30-minute consultation call to
                discuss your project.
              </p>
              <button
                onClick={handleCalendarBooking}
                className="btn-secondary ring-2 ring-ring group flex items-center gap-2 cursor-target"
              >
                <Calendar size={18} />
                Book Free Consultation
                <ExternalLink
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
            </div>
            <BookingModal
              isOpen={isBookingOpen}
              onClose={() => setIsBookingOpen(false)}
            />

            {/* Social Links */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">
                Follow My Work
              </h4>
              <div className="flex gap-4 ">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 border border-white/20 hover:chart-1/10 transition-all duration-300 group cursor-target hover:-translate-y-3"
                    title={platform.name}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300 inline-block hover:text-chart-1">
                      {platform.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-foreground font-medium mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-background border border-white/20 text-foreground focus:border-[#00FFD1] focus:ring-1 focus:ring-[#00FFD1] outline-none transition-colors duration-300 cursor-target"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-foreground font-medium mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-background border border-white/20 text-foreground focus:border-[#00FFD1] focus:ring-1 focus:ring-[#00FFD1] outline-none transition-colors duration-300 cursor-target"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="company"
                    className="block text-foreground font-medium mb-2"
                  >
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-background border border-white/20 text-foreground focus:border-[#00FFD1] focus:ring-1 focus:ring-[#00FFD1] outline-none transition-colors duration-300 cursor-target"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-foreground font-medium mb-2"
                  >
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-background border border-white/20 text-foreground focus:border-[#00FFD1] focus:ring-1 focus:ring-[#00FFD1] outline-none transition-colors duration-300 cursor-target"
                  >
                    <option value="">Select a service</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="web-development">Web Development</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="security-consulting">
                      Security Consulting
                    </option>
                    <option value="custom-project">Custom Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-foreground font-medium mb-2"
                >
                  Project Details *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full p-3 bg-background border border-white/20 text-foreground focus:border-[#00FFD1] focus:ring-1 focus:ring-[#00FFD1] outline-none transition-colors duration-300 resize-vertical cursor-target"
                  placeholder="Tell me about your project, goals, timeline, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-primary bg-chart-1 group flex items-center justify-center gap-3 cursor-target ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {isSubmitting
                  ? "Sending Message..."
                  : "Send a Message Via WhatsApp"}
              </button>

              <p className="text-sm text-muted-foreground text-left mt-4">
                Prefer email? Send me a message at{" "}
                <a
                  href="mailto:nexus.dynasty.org@gmail.com"
                  className="text-chart-1 underline"
                >
                  nexus.dynasty.org@gmail.com
                </a>
              </p>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-muted-foreground text-center">
                By submitting this form, you agree to our privacy policy. Your
                information will be used solely for project communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
